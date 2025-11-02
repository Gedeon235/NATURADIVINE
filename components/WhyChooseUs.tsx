
'use client';

export default function WhyChooseUs() {
  const features = [
    {
      icon: "ri-leaf-line",
      title: "Produits Naturels",
      description: "Tous nos produits sont formulés avec des ingrédients naturels et biologiques certifiés"
    },
    {
      icon: "ri-award-line",
      title: "Qualité Premium",
      description: "Sélection rigoureuse de marques reconnues pour leur excellence et leur efficacité"
    },
    {
      icon: "ri-user-heart-line",
      title: "Conseils Experts",
      description: "Notre équipe d'esthéticiennes vous guide dans le choix des produits adaptés"
    },
    {
      icon: "ri-truck-line",
      title: "Livraison Rapide",
      description: "Expédition sous 24h avec emballage soigné et écologique"
    },
    {
      icon: "ri-shield-check-line",
      title: "Garantie Satisfait",
      description: "Remboursement intégral si vous n'êtes pas satisfait de votre commande"
    },
    {
      icon: "ri-customer-service-line",
      title: "Service Client",
      description: "Équipe dédiée disponible 6j/7 pour répondre à toutes vos questions"
    }
  ];

  return (
    <section className="py-20 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les avantages qui font de NaturaDivineBeauté votre partenaire beauté de confiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-emerald-100 rounded-full">
                <i className={`${feature.icon} text-2xl text-emerald-600`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
