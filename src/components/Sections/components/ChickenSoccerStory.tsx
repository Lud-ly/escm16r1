import React from "react";
import Slider from "react-slick";

const ChickenSoccerStory = () => {

    const settings = {
        dots: false, // Activer les points de pagination
        infinite: true, // Boucle infinie
        speed: 500, // Vitesse de transition
        slidesToShow: 1, // Nombre d'éléments à afficher à la fois
        slidesToScroll: 1, // Nombre d'éléments à défiler à la fois
        autoplay: true, // Activer le défilement automatique
        autoplaySpeed: 3000, // Temps (en ms) entre les défilements
        pauseOnHover: true, // Mettre en pause le défilement lors du survol
    };

    return (
        <div className="p-5">
            <Slider {...settings}>
                <iframe src="https://giphy.com/embed/elatsjsGzdLtNov4Ky" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/iJhcSIRE8IhJEwWudO" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/loeVS7xSL1o46LxeoK" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/S6kvJjp6iGB6YXMbK4" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/Kg9DmEoDJjhC1gWPHE" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/QCIa3WEcgZCa6YmJT5" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/fUGW4erfIYUJRoZIwZ" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/L2llNi8VK3XgfuDUKR" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/SYoYIr1xwXExnGaQuM" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/Sql4zgbgJCH2BtdJT8" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/U6eTGDLMa0L1FWkL9Z" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/jRwKzj28kaAxbfH5fC" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/kyXRKuEYmGhscoz3ki" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
                <iframe src="https://giphy.com/embed/llUeFDNRaLWvokhbat" width="100%" className="mb-8 rounded" allowFullScreen></iframe>
            </Slider>
        </div>
    )
}

export default ChickenSoccerStory;