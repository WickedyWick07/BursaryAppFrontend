import bursaryProviders  from "../constants/bursaryProviders";
import Header from "./Header";

const BursaryProviders = () => {
  return (
    
    <div>
        <Header /> 
    
        <h1 className='text-center m-4 font-semibold text-3xl'>Bursary Sponsors</h1>                  
    <div className='grid grid-cols-3 md:grid-cols-3 gap-6 w-full p-5'>
      {Object.values(bursaryProviders).map((provider) => (
  <div
    key={provider.name}
    className="flex flex-col items-center bg-gray-100 p-4 rounded shadow mb-4"
  >
    <img
      src={provider.logo}
      alt={`${provider.name} logo`}
      className="w-32 h-32 mb-4"
    />
    <h3 className="text-xl font-semibold">{provider.name}</h3>
    <p className="text-sm text-gray-600">{provider.description}</p>
    <a
      href={provider.website}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-blue-800 px-20 m-2 p-2 hover:bg-blue-500 hover:text-white text-blue-500 hover:underline mt-2"
    >
      Visit Website
    </a>
  </div>
))}

      
    </div>
    </div>
     
  )
}

export default BursaryProviders
