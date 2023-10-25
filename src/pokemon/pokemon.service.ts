import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create({
        ...createPokemonDto,
        name: createPokemonDto.name.toLowerCase(),
      });
      return pokemon;
    } catch (error) {
     this.handleExceptions(error);
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonToUpdate = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    if (!pokemonToUpdate) {
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );
    }
    try {
      await pokemonToUpdate.updateOne(updatePokemonDto, { new: true });
      return { ...pokemonToUpdate.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount} = await this.pokemonModel.deleteOne({ _id: id });

    if(deletedCount === 0){
      throw new BadRequestException(
        `Pokemon with id "${id}" not found`,
      )
    }

    return 
  }

  private handleExceptions(error:any){
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon with the property ${JSON.stringify(
          error.keyValue,
        )} already exists`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't update Pokemon -Check server logs`,
    );
  }

}
