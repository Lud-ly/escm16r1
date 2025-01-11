import React, { useState, useEffect } from "react";
import Image from "next/image";
import anime from "animejs";
import { useRouter } from "next/navigation";

const SplashScreen = ({ finishLoading }: { finishLoading: () => void }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0); // État pour suivre l'écran actuel
    const [bgColor, setBgColor] = useState("white"); // Couleur de fond initiale
    const [hasShownSplash, setHasShownSplash] = useState(false); // État pour vérifier si le splash a été affiché
    const router = useRouter();

    const animate = () => {
        const loader = anime.timeline({
            complete: () => {
                finishLoading();
                setHasShownSplash(true); // Met à jour l'état pour indiquer que le splash a été affiché
                setTimeout(() => {
                    router.push("/"); // Redirection vers la page d'accueil
                }, 6000);
            },
        });

        loader
            .add({
                targets: "#gif",
                opacity: [0, 1],
                duration: 1000,
                easing: "easeInOutExpo",
            })
            .add({
                targets: "#gif",
                opacity: [1, 0],
                duration: 1000,
                easing: "easeInOutExpo",
                complete: () => {
                    setCurrentScreen(1); // Passer au logo 1
                },
            })
            .add({
                targets: "#logo1",
                scale: [0, 1],
                duration: 500,
                easing: "easeInOutExpo",
            })
            .add({
                targets: "#logo1",
                delay: 100,
                scale: 1.25,
                duration: 500,
                easing: "easeInOutExpo",
            })
            .add({
                targets: "#logo1",
                delay: 100,
                scale: 1,
                duration: 500,
                easing: "easeInOutExpo",
            })
            .add({
                targets: "#logo1",
                opacity: 0, // Fait disparaître le logo 1
                duration: 500,
                easing: "easeInOutExpo",
                complete: () => {
                    setCurrentScreen(2); // Passer au logo 2
                },
            })
            .add({
                targets: "#logo2",
                scale: [0, 1],
                duration: 500,
                easing: "easeInOutExpo",
                begin: () => {
                    setBgColor("#fff"); // Change la couleur de fond
                },
                complete: () => setBgColor("#fff"), // Assure que la couleur de fond reste
            })
            .add({
                targets: "#logo2",
                delay: 100,
                scale: 1.25,
                duration: 500,
                easing: "easeInOutExpo",
            })
            .add({
                targets: "#logo2",
                delay: 100,
                scale: 1,
                duration: 500,
                easing: "easeInOutExpo",
            });
    };

    useEffect(() => {
        // Vérifie si le splash screen a déjà été affiché
        if (!hasShownSplash) {
            const timeout = setTimeout(() => setIsMounted(true), 10);
            animate();
            return () => clearTimeout(timeout);
        }
    }, [hasShownSplash]);

    return (
        <div className="flex h-screen items-center justify-center" style={{ backgroundColor: bgColor }}>
            {isMounted && (
                <>
                    {currentScreen === 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-2xl text-center font-bold py-2 uppercase">
                                Les Rôtis du F⚽⚽t
                            </h2>
                            <iframe
                                id="gif"
                                src="https://giphy.com/embed/elatsjsGzdLtNov4Ky"
                                width="240"
                                height="203"
                                className="giphy-embed"
                                allowFullScreen
                            />
                        </div>
                    )}
                    {currentScreen === 1 && ( // Affiche le logo 1
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-2xl text-center font-bold py-2 uppercase">
                                U16 R1 Occitanie
                            </h2>
                            <Image
                                id="logo1"
                                src="/images/lfo.png"
                                alt="Logo 1"
                                width={150}
                                height={150}
                            />
                        </div>
                    )}
                    {currentScreen === 2 && ( // Affiche le logo 2
                        <Image
                            id="logo2"
                            src="/images/logo.png"
                            alt="Logo 2"
                            width={230}
                            height={230}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default SplashScreen;
