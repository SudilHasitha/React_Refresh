import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import { useDebounce } from 'react-use'
import { Company, CompanyLogoRow } from './types.ts'
import Spinner from './components/Spinner.tsx'
import LogoCard from './components/LogoCard.tsx'

const API_BASE_URL = 'https://api.logo.dev';
const API_KEY = import.meta.env.VITE_LOGOAPI_KEY;
const BACKEND_URL = 'http://localhost:3000';



const API_OPTIONS = {
  headers: {
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('apple');

  const [logoList, setLogoList] = useState<Company[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingCompanyLogos, setTrendingCompanyLogos] = useState<CompanyLogoRow[]>([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const getTrendingCompanyLogos = async () => {
    try{
      const response = await fetch(`${BACKEND_URL}/api/trending`);

      if (!response.ok){
        throw new Error('Failed to fetch trending logos')
      }
      const data = await response.json()
      setTrendingCompanyLogos(data)
    } catch (error) {
      console.log('Error fetching trending logos: ',error);
    }
  }

  const updateSearchCount = async (searchTerm: string, company: Company) => {
    try{
      const response = await fetch(`${BACKEND_URL}/api/search`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({searchTerm, company}) 
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update search count in custom backend');
      }
      const data = await response.json()
      return data.success;
    } catch (error) {
      console.log('Error updating search count ', error);
      return false;
    }
  }

  const fetchCompanyLogos = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/search?q=${encodeURIComponent('apple')}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch company logos');
      }

      const data = await response.json();
      console.log("data -> ",data);
      console.log("data.Response -> ",data.Response);
      console.log("data.results -> ",data.results);
      console.log("data.length -> ",data.length);


      if(data.length === 0) {
        setErrorMessage(data || 'Failed to fetch company logos');
        setLogoList([]);
        return;
      }

      setLogoList(data|| []);

      if(query && data.length > 0) {
        await updateSearchCount(query, data[0]);
      }
    } catch (error) {
      console.error(`Error fetching company logos: ${error}`);
      setErrorMessage('Error fetching company logos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanyLogos(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getTrendingCompanyLogos();
  }, []);

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Company Logos</span> You Need</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingCompanyLogos.length > 0 && (
          <section className="trending">
            <h2>Trending Companies</h2>

            <ul>
              {trendingCompanyLogos.map((company, index) => (
                <li key={company.id}>
                  <p>{index + 1}</p>
                  <img src={company.logo_url} alt={company.name} />
                  <div className="mt-4">
                     <h3>{company.name}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-logos">
          <h2>All Companies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {logoList.map((company) => (
                <LogoCard key={company.domain} companyLogo={company} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App