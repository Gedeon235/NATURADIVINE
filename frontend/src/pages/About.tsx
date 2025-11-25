import * as React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

const team: TeamMember[] = [
  {
    name: 'PESSEM GEDEON',
    role: 'PDG & Fondateur',
    image: 'https://static.readdy.ai/image/ae68f58e532b446f1abe268b5b246e99/26c1fd3fedeaeb814d312c38656a696b.jfif',
    description: 'Visionnaire et entrepreneur passionné, PESSEM GEDEON a fondé NaturaDivineBeauté avec pour mission de révolutionner l\'industrie de la beauté naturelle au Tchad.'
  },
  {
    name: 'Marie Lefevre',
    role: 'Esthéticienne Spécialisée',
    image: 'https://readdy.ai/api/search-image?query=professional%20female%20esthetician%20in%20spa%20uniform%2C%20friendly%20and%20professional%20appearance%2C%20beauty%20therapist%20portrait%2C%20skilled%20skincare%20specialist%2C%20welcoming%20smile%2C%20spa%20environment%20background&width=400&height=400&seq=team2&orientation=squarish',
    description: 'Diplômée en esthétique avec 10 ans d\'expérience, Marie vous accompagne dans tous vos soins personnalisés.'
  },
  {
    name: 'Claire Martin',
    role: 'Conseillère Beauté',
    image: 'https://readdy.ai/api/search-image?query=professional%20beauty%20consultant%2C%20friendly%20female%20advisor%2C%20natural%20makeup%20and%20skincare%20expert%2C%20professional%20portrait%2C%20beauty%20industry%20professional%2C%20warm%20and%20approachable%20expression&width=400&height=400&seq=team3&orientation=squarish',
    description: 'Experte en conseil beauté personnalisé, Claire vous aide à trouver les produits parfaits pour votre peau.'
  }
];

const values: Value[] = [
  {
    icon: 'ri-leaf-line',
    title: 'Naturel & Bio',
    description: 'Nous privilégions les ingrédients naturels et biologiques pour respecter votre peau et l\'environnement.'
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Qualité Premium',
    description: 'Chaque produit est rigoureusement sélectionné selon nos critères de qualité les plus élevés.'
  },
  {
    icon: 'ri-heart-line',
    title: 'Passion & Expertise',
    description: 'Notre équipe partage une passion authentique pour la beauté naturelle et le bien-être.'
  },
  {
    icon: 'ri-user-heart-line',
    title: 'Service Client',
    description: 'Nous vous accompagnons personnellement dans votre parcours beauté avec des conseils experts.'
  }
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=elegant%20natural%20beauty%20spa%20interior%2C%20serene%20wellness%20environment%2C%20luxury%20spa%20atmosphere%2C%20natural%20lighting%2C%20peaceful%20sanctuary%2C%20organic%20beauty%20treatments%2C%20sophisticated%20spa%20design%2C%20calming%20ambiance&width=1200&height=600&seq=about-hero&orientation=landscape)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            À Propos de Nous
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Découvrez l\'histoire et les valeurs qui nous animent dans notre mission 
            de vous offrir le meilleur de la beauté naturelle
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
            <p className="text-lg text-gray-600 mb-6">
              NaturaDivineBeauté n'est pas qu'une simple marque ; elle est le fruit d'une passion profonde pour la beauté naturelle et d'une révélation personnelle. Durant des années, j'ai cherché des produits cosmétiques qui allient réellement l'efficacité à la pureté des ingrédients, sans compromis sur la santé ou l'éthique. Ce cheminement m'a menée à un constat, simple mais puissant : la nature luxuriante du Tchad, notre terre, regorge de trésors insoupçonnés, des secrets de beauté ancestraux transmis de génération en génération.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              J'ai passé du temps à explorer nos marchés locaux, à échanger avec les femmes qui, depuis toujours, utilisent le beurre de karité des arbres majestueux de Moundou ou l'huile précieuse de moringa pour leurs soins quotidiens. J'ai été émerveillée par la richesse de ces ressources, par leurs propriétés exceptionnelles, et par la sagesse qui les entoure.
            </p>
            <p className="text-lg text-gray-600">
              C'est de cette immersion, de cette quête d'authenticité et de cette admiration pour nos propres richesses, qu'est née l'étincelle de NaturaDivineBeauté. J'ai pris la décision de ne plus chercher, mais de créer ma propre ligne de cosmétiques. Une ligne qui puise directement dans ces ingrédients locaux et puissants, une ligne qui honore nos traditions tout en offrant des formules modernes, divinement efficaces. Chaque produit de NaturaDivineBeauté est une invitation à redécouvrir la puissance de la nature tchadienne au service de votre beauté.
            </p>
          </div>
          <div>
            <ImageWithFallback
              src="https://readdy.ai/api/search-image?query=Chad%20natural%20beauty%20ingredients%2C%20African%20shea%20butter%20from%20Moundou%2C%20moringa%20oil%2C%20traditional%20beauty%20secrets%2C%20natural%20skincare%20products%2C%20local%20markets%2C%20women%20using%20traditional%20cosmetics%2C%20authentic%20African%20beauty%20rituals&width=600&height=500&seq=about-story-chad&orientation=landscape"
              alt="Notre histoire"
              className="rounded-lg shadow-lg object-cover object-top w-full"
            />
          </div>
        </div>

        <div className="mb-20">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mission et Vision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                  <i className="ri-target-line text-2xl text-emerald-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Notre Mission</h3>
                <p className="text-gray-600">
                  Notre mission est de vous offrir des cosmétiques purs et efficaces, formulés avec des ingrédients naturels et éthiques.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                  <i className="ri-eye-line text-2xl text-emerald-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Notre Vision</h3>
                <p className="text-gray-600">
                  Notre vision est de révéler la beauté divine qui est en chacun, tout en valorisant les ressources de notre terroir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                  <i className={`${value.icon} text-2xl text-emerald-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-top"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Rejoignez Notre Communauté</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez nos dernières nouveautés, bénéficiez de conseils exclusifs et 
            participez à notre mouvement pour une beauté plus naturelle et responsable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
            >
              Découvrir nos produits
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-md border border-emerald-600 hover:bg-emerald-50 transition-colors font-medium cursor-pointer whitespace-nowrap"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;

