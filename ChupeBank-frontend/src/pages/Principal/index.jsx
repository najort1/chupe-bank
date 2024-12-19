import Header from "../../components/Header";
import Footer from "../../components/Footer";

import Button1 from '../../components/Buttons/Button1'


import { Swiper, SwiperSlide } from "swiper/react";
import './anim.css'
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/parallax";
import { Autoplay, Parallax } from "swiper/modules";

import javaLogo from "../../assets/java.png";
import springBootLogo from "../../assets/spring.svg";
import reactLogo from "../../assets/react.svg";
import tailWindLogo from "../../assets/tailwind-css.svg";
import postgresLogo from "../../assets/postgresql.svg";
import chupetaoComDinheiro from "../../assets/LOGO.webp";
import { useInView } from 'react-intersection-observer';
import Chupetao from "../../assets/CHUPETAO.jpg";
import styledComponents from "../../assets/styled-components.png";

import {
  BrowserView,
  MobileView,
  isMobile,
  isTablet,
} from "react-device-detect";
import { useNavigate } from "react-router-dom";

const Principal = () => {
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: ref3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: ref4, inView: inView4 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  const slides = [
    { name: 'java', img: javaLogo, alt: 'Java', tamanhoMobile: 'h-12', tamanhoTablet: 'h-24', tamanhoDesktop: 'h-12' },
    { name: 'spring', img: springBootLogo, alt: 'Spring Boot ', tamanhoMobile: 'h-12', tamanhoTablet: 'h-24', tamanhoDesktop: 'h-12' },
    { name: 'react', img: reactLogo, alt: 'React', tamanhoMobile: 'h-12', tamanhoTablet: 'h-24', tamanhoDesktop: 'h-12' },
    { name: 'tailwind', img: tailWindLogo, alt: 'Tailwind CSS', tamanhoMobile: 'h-12', tamanhoTablet: 'h-24', tamanhoDesktop: 'h-12' },
    { name: 'postgres', img: postgresLogo, alt: 'PostgreSQL', tamanhoMobile: 'h-12', tamanhoTablet: 'h-24', tamanhoDesktop: 'h-12' },
    { name: 'styledComponents', img: styledComponents, alt: 'Styled Components', tamanhoMobile: 'h-12', tamanhoTablet: 'h-24', tamanhoDesktop: 'h-12' },

  ]

  return (
    <>
      <Header />

      <main className="sobre-o-projeto mt-8 flex flex-col">
        
        <div className="chupetao-img">
          <img
            src={chupetaoComDinheiro}
            alt="Chupetão"
            className="w-full md:w-full md:h-48 xl:h-[200px] object-fill object-center
                xl:hidden
            "
          />
        </div>

        <div
          className="cards-sobre flex w-full flex-row gap-2 items-center 
            xl:flex
            xl:flex-col
            xl:items-start
        "
        >
          <div 
            ref={ref1}
          className={`card-item dark:bg-gray-800 p-2 shadow-lg mt-4 xl:rounded-2xl fade-in ${inView1 ? 'visible' : ''}
            xl:w-full`}
          >
            <h1 className="titulo-principal font-bold text-2xl text-green-800 dark:text-white text-center">
              Sobre o projeto
            </h1>
            <p className="texto-principal mt-4 text-gray-600 font-semibold dark:text-gray-300
                xl:w-[60%] xl:text-center xl:mx-auto
            ">
              O ChupeBank é um projeto desenvolvido com o intuito de simular um
              banco digital. O projeto foi desenvolvido por Eduardo Oliveira da Silva visando aprimorar suas habilidades em React e Spring Boot. Nesse projeto é possível realizar operações bancárias como transferências, saques e depósitos.
            </p>
          </div>
        </div>

        <div className="cards-sobre w-full flex flex-col items-end mt-4
            xl:items-center
        ">
          <div 
          ref={ref2}
          className={`card-item dark:bg-gray-800 p-2 shadow-lg w-full rounded-2xl xl:w-[50%] fade-in ${inView2 ? 'visible' : ''}`}>
            <h1 className="titulo-principal font-bold text-2xl text-green-800 dark:text-white text-center">
              O mascote
            </h1>
            <p className="texto-principal mt-4 text-gray-600 font-semibold dark:text-gray-300 text-center">
              O mascote do ChupeBank é o cachorro Chupetão, um meme que foi
              popularizado por volta de 2023. Ele em si não representa nada do projeto, o desenvolvedor do projeto apenas achou engraçado e decidiu adotar como mascote. O Chupetão é um cachorro com uma aparência engraçada e um olhar de quem não está entendendo nada.
            </p>
            <div className="chupetao-img flex justify-center items-center mt-4">
              <img
                src={Chupetao}
                alt="Chupetão"
                className="w-full md:w-full md:h-48 xl:h-48 xl:w-48 object-fill object-center"
              />
            </div>
          </div>
        </div>

        <div className="cards-sobre w-full flex flex-col items-start mt-4
            xl:items-center
        ">
          <div 
          ref={ref4}
          className={`card-item dark:bg-gray-800 p-2 shadow-lg rounded-2xl xl:w-[50%] fade-in ${inView4 ? 'visible' : ''}`}>
            <h1 className="titulo-principal font-bold text-2xl text-green-800 dark:text-white text-center">
              Cadastre-se ou faça login
            </h1>
            <p className="texto-principal mt-4 text-gray-600 font-semibold dark:text-gray-300 text-center">
                Faça login ou cadastre-se para acessar o ChupeBank. Com o ChupeBank você pode realizar operações bancárias como transferências, saques e depósitos. Entre outras funcionalidades, crie sua conta ou faça login para acessar o ChupeBank.
            </p>

            <div className="botoes-card-login flex flex-row justify-around mt-4">
                <Button1
                    text="Login"
                    color="green"
                    onClick={() => navigate("/login")}
                />
                <Button1
                    text="Cadastre-se"
                    color="green"
                    onClick={() => navigate("/cadastro")}
                />

            </div>

          </div>
        </div>

        <div className="cards-sobre w-full flex flex-col items-start mt-4">
          <div 
          ref={ref3}
          className={`card-item dark:bg-gray-800 p-2 shadow-lg w-full rounded-2xl fade-in ${inView3 ? 'visible' : ''}`}>
            <h1 className="titulo-principal font-bold text-2xl text-green-800 dark:text-white text-center">
              Tecnologias
            </h1>
            <p className="texto-principal mt-4 text-gray-600 font-semibold dark:text-gray-300 mb-12
                xl:w-[80%] xl:text-center xl:mx-auto
            ">
              O projeto foi desenvolvido utilizando as tecnologias mais atuais
              do mercado. e também criptografia AES (Advanced Encryption
              Standard) para garantir a segurança das informações. para evitar
              que terceiros tenham acesso a informações sensíveis. A utilização da criptografia foi feita para simular ao maximo um ambiente real de um banco digital.
            </p>

            {isMobile && !isTablet && (
              <MobileView>
                <Swiper
                  spaceBetween={50}
                  slidesPerView={3}
                  loop={true}
                  autoplay={{ disableOnInteraction: false, delay: 1000 }}
                  modules={[Autoplay, Parallax]}
                >
                  {slides.map((slide) => (
                    <SwiperSlide key={slide.name}>
                      <img
                        src={slide.img}
                        alt={slide.alt}
                        className={slide.tamanhoMobile}
                      />
                    </SwiperSlide>
                  ))}
  

                </Swiper>
              </MobileView>
            )}

            {isTablet && isMobile && (
              <Swiper
                spaceBetween={100}
                slidesPerView={4}
                loop={true}
                autoplay={{ disableOnInteraction: false, delay: 1000 }}
                modules={[Autoplay, Parallax]}
              >

                {slides.map((slide) => (
                  <SwiperSlide key={slide.name}>
                    <img
                      src={slide.img}
                      alt={slide.alt}
                      className={slide.tamanhoTablet}
                    />
                  </SwiperSlide>
                ))}

              </Swiper>
            )}

            <BrowserView>
              <Swiper
                spaceBetween={50}
                slidesPerView={4}
                centeredSlides={true}
                centeredSlidesBounds={true}
                autoplay={{ disableOnInteraction: false, delay: 1000 }}
                modules={[Autoplay, Parallax]}
              >

                {slides.map((slide) => (
                  <SwiperSlide key={slide.name}>
                    <img
                      src={slide.img}
                      alt={slide.alt}
                      className={slide.tamanhoDesktop}
                    />
                  </SwiperSlide>
                ))}


              </Swiper>
            </BrowserView>
          </div>


        </div>



      </main>
            <Footer />
    </>
  );
};

export default Principal;
