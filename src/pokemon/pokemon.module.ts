import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonSchema, Pokemon } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
})
export class PokemonModule {}
