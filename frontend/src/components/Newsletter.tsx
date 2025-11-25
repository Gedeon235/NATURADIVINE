import { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Restez informée
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir nos conseils beauté, nouveautés et offres exclusives
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                S'inscrire
              </button>
            </div>
          </form>

          {isSubscribed && (
            <p className="mt-4 text-emerald-400 font-medium">
              Merci pour votre inscription ! Vous recevrez bientôt nos actualités.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

