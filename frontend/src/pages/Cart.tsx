import { useState } from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';

interface Promo {
  code: string;
  discount: number;
  label: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Sérum Vitamine C Bio',
      price: 28000,
      quantity: 1,
      image: 'https://readdy.ai/api/search-image?query=natural%20vitamin%20c%20serum%20bottle%20with%20dropper%20on%20clean%20white%20background%2C%20organic%20skincare%20product%2C%20professional%20photography%2C%20soft%20lighting&width=150&height=150&seq=cartserum1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Crème Hydratante Aloe Vera',
      price: 22000,
      quantity: 2,
      image: 'https://readdy.ai/api/search-image?query=aloe%20vera%20moisturizer%20cream%20jar%20on%20white%20background%2C%20natural%20skincare%20product%2C%20green%20plant%20elements%2C%20clean%20minimalist%20style&width=150&height=150&seq=cartcream1&orientation=squarish'
    },
    {
      id: 3,
      name: 'Masque Argile Purifiante',
      price: 18000,
      quantity: 1,
      image: 'https://readdy.ai/api/search-image?query=clay%20mask%20jar%20with%20green%20clay%2C%20natural%20skincare%20product%2C%20spa%20setting%2C%20clean%20white%20background&width=150&height=150&seq=cartmask1&orientation=squarish'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
   const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);

  const updateQuantity = (id:number, newQuantity:number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id:number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', discount: 0.1, label: '10% de réduction' });
    } else if (promoCode === 'BEAUTY20') {
      setAppliedPromo({ code: 'BEAUTY20', discount: 0.2, label: '20% de réduction' });
    } else {
      alert('Code promo invalide');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const shipping = subtotal > 25000 ? 0 : 3000;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shopping-cart-line text-gray-400 text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
              Découvrez nos produits et services de beauté naturelle
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/products" 
                className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Voir les produits
              </Link>
              <Link 
                to="/services" 
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Réserver un service
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
          <p className="text-gray-600">{cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Produits</h2>
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover object-top rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-emerald-600 font-semibold">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Code promo"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Appliquer
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-md">
                      <span className="text-green-700 font-medium">
                        Code {appliedPromo.code} appliqué - {appliedPromo.label}
                      </span>
                      <button
                        onClick={removePromo}
                        className="text-green-700 hover:text-green-800 cursor-pointer"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise ({appliedPromo.label})</span>
                    <span>-{discount.toLocaleString()} FCFA</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratuite' : `${shipping.toLocaleString()} FCFA`}
                  </span>
                </div>
                
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    ✓ Livraison gratuite dès 25 000 FCFA
                  </p>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Mode de paiement</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="mobile" className="mr-3 text-emerald-600" defaultChecked />
                    <div className="flex items-center">
                      <i className="ri-smartphone-line text-emerald-600 mr-2"></i>
                      <span className="text-sm font-medium">Mobile Money</span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 ml-8">Orange Money, Moov Money, Airtel Money</p>
                  
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="delivery" className="mr-3 text-emerald-600" />
                    <div className="flex items-center">
                      <i className="ri-truck-line text-emerald-600 mr-2"></i>
                      <span className="text-sm font-medium">Paiement à la livraison</span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 ml-8">Payez en espèces à la réception</p>
                </div>
              </div>

              <button className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium mt-6 cursor-pointer whitespace-nowrap">
                Procéder au paiement
              </button>

              <div className="mt-4 text-center">
                <Link 
                  to="/products" 
                  className="text-emerald-600 hover:text-emerald-700 text-sm cursor-pointer"
                >
                  ← Continuer mes achats
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Informations de livraison</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Livraison gratuite dès 25 000 FCFA</p>
                  <p>• Délai de livraison : 2-3 jours ouvrables</p>
                  <p>• Livraison disponible à Ndjamena</p>
                  <p>• Paiement sécurisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Produits recommandés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[ 
              {
                name: 'Huile Essentielle Lavande',
                price: '15 000 FCFA',
                image: 'https://readdy.ai/api/search-image?query=lavender%20essential%20oil%20bottle%20with%20lavender%20flowers%2C%20natural%20aromatherapy%20product%2C%20purple%20theme%2C%20clean%20white%20background&width=200&height=200&seq=oil1&orientation=squarish'
              },
              {
                name: 'Gommage Corps Coco',
                price: '25 000 FCFA',
                image: 'https://readdy.ai/api/search-image?query=coconut%20body%20scrub%20jar%20with%20coconut%20pieces%2C%20natural%20exfoliating%20product%2C%20tropical%20theme%2C%20clean%20white%20background&width=200&height=200&seq=scrub1&orientation=squarish'
              },
              {
                name: 'Baume à Lèvres Karité',
                price: '8 000 FCFA',
                image: 'https://readdy.ai/api/search-image?query=shea%20butter%20lip%20balm%20tube%20with%20shea%20nuts%2C%20natural%20lip%20care%20product%2C%20elegant%20packaging%2C%20clean%20white%20background&width=200&height=200&seq=balm1&orientation=squarish'
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover object-top"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-semibold">{product.price}</span>
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700 transition-colors text-sm cursor-pointer whitespace-nowrap">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
