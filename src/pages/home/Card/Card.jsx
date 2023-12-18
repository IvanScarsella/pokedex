import React, { useEffect, useState } from "react";
import css from "./card.module.scss";
import axios from "axios";
import { URL_POKEMON, URL_ESPECIES, URL_EVOLUCIONES } from "../../../api/apiRest";

export default function Card({ card }) {
    const [itemPokemon, setItemPokemon] = useState({});
    const [speciePokemon, setSpeciePokemon] = useState({})
    const [evolutions, setEvolutions] = useState([]);

    useEffect(() => {
        const dataPokemon = async () => {
            const api = await axios.get(`${URL_POKEMON}/${card.name}`);
            setItemPokemon(api.data);
        };
        dataPokemon();
    }, [card]);

    useEffect(() => {
        const dataEspecie = async () => {
            const URL = card.url.split("/");
            const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
            setSpeciePokemon({
                url_specie: api?.data?.evolution_chain?.url,
                data: api?.data,
            });
        };
        dataEspecie();
    }, [card]);

    let pokeId = itemPokemon?.id?.toString()

    if (pokeId?.length === 1) {
        pokeId = "00" + pokeId
    } else if (pokeId?.length === 2) {
        pokeId = "0" + pokeId
    }

    useEffect(() => {
        async function getPokemonImage(id) {
            const response = await axios.get(`${URL_POKEMON}/${id}`);
            return response?.data?.sprites?.other["official-artwork"]?.front_default;
        }
        if (speciePokemon?.url_specie) {
            const getEvolutions = async () => {
                const arrayEvolutions = [];
                const URL = speciePokemon?.url_specie?.split("/");
                const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);
                const URL2 = api?.data?.chain?.species?.url?.split("/");
                const img1 = await getPokemonImage(URL2[6]);
                arrayEvolutions.push({
                    img: img1,
                    name: api?.data?.chain?.species?.name,
                })
                console.log(arrayEvolutions);
                if (api?.data?.chain?.evolves_to?.length) {
                    const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
                    const URL3 = DATA2?.url?.split("/");
                    const img2 = await getPokemonImage(URL3[6]);
                    arrayEvolutions.push({
                        img: img2,
                        name: DATA2?.name,
                    });
                }
                setEvolutions(arrayEvolutions);
            }
            getEvolutions()
        }
    }, [speciePokemon])

    return (
        <div className={css.card}>
            <img
                src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
                alt="pokemon"
                className={css.img_card}
            />
            <div className={`bg-${speciePokemon?.data?.color?.name} ${css.sub_card}`}>
                <strong className={css.id_card}>{pokeId}</strong>
                <strong className={css.name_card}>{itemPokemon?.name}</strong>
                <h4 className={css.height_card}>Height: {itemPokemon?.height}0 cm</h4>
                <h4 className={css.weight_card}>Weight: {itemPokemon?.weight} Kg</h4>
                <h4 className={css.habitat_card}>Habitat: {speciePokemon?.data?.habitat?.name}</h4>
                <div className={css.div_stats}>
                    {itemPokemon?.stats?.map((sta, index) => {
                        return (
                            <h6 key={index} className={css.item_stats}>
                                <span className={css.name}>{sta.stat.name}</span>
                                <progress value={sta.base_stat} max={110}></progress>
                                <span className={css.number}>{sta.base_stat}</span>
                            </h6>
                        );
                    })}
                </div>
                <div className={css.div_type_color}>
                    {itemPokemon?.types?.map((type, index) => {
                        return (
                            <h6
                                key={index}
                                className={`color-${type.type.name} ${css.color_type}`}
                            >
                                {type.type.name}
                            </h6>
                        );
                    })}
                </div>
                <div className={css.div_evolution}>
                    {evolutions.map((evo, index) => {
                        return (
                            <div key={index} className={css.item_evo}>
                                <img src={evo.img} alt="" className={css.evo_img} />
                                <h6>{evo.name}</h6>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}