import React, { useEffect, useState } from "react";
import css from "./layout.module.scss";
import Header from "../header/Header";
import axios from "axios";
import { URL_POKEMON } from "../../../api/apiRest";
import Card from "../Card/Card";
import * as FaIcons from "react-icons/fa";

export default function LayoutHome() {

    const [arrayPokemon, setArrayPokemon] = useState([]);

    const [allPokemons, setAllPokemons] = useState([])

    const [forPage, setForPage] = useState(1)

    const [search, setSearch] = useState("");

    const getNamePokemon =(e)=>{
        console.log(e);
        const text = e.toLowerCase();
        setSearch(text);
        setForPage(1);
        }

    useEffect(() => {
        const api = async () => {
            const limit = 15;
            const page = (forPage - 1) * limit;
            const apiPoke = await axios.get(`${URL_POKEMON}/?offset=${page}&limit=${limit}`);
            setArrayPokemon(apiPoke.data.results);
        };
        api();
        getAllPokemons();
    }, [forPage]);

    const getAllPokemons = async () => {
        const res = await axios.get(`${URL_POKEMON}/?offset=0&limit=1100`);
        const promises = res.data.results.map(pokemon => {
            return pokemon
        })
        const results = await Promise.all(promises);
        setAllPokemons(results)
    }

    const filterPokemon =
        search?.length > 0
            ? allPokemons?.filter((pokemon) => pokemon?.name?.includes(search))
            : arrayPokemon;

    return (
        <>
            <section className={css.section_pagination}>
                <div className={css.div_pagination}>
                    <span
                        className={css.item_left}
                        onClick={() => {
                            if (forPage === 1) {
                                return console.log("no puedo retroceder");
                            }
                            setForPage(forPage - 1);
                        }}
                    >
                        <FaIcons.FaAngleLeft />
                    </span>
                    <span className={css.item}>{forPage}</span>
                    <span className={css.item}> De </span>
                    <span className={css.item}>
                        {Math.round(allPokemons?.length / 15)}
                    </span>
                    <span
                        className={css.item_right}
                        onClick={() => {
                            if (forPage === 73) {
                                return console.log("es el ultimo");
                            }
                            setForPage(forPage + 1);
                        }}
                    >
                        <FaIcons.FaAngleRight />
                    </span>
                </div>
            </section>
            <div>
                <Header getNamePokemon={getNamePokemon} />
                <div className={css.card_content}>
                    {filterPokemon.map((card, index) => {
                        return (
                            <Card key={index} card={card} />
                        )
                    })}
                </div>
            </div>
        </>
    );
}