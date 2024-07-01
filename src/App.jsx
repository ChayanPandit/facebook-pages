
import FacebookLogin from 'react-facebook-login';
import { useEffect, useState } from 'react'
import { CiCircleInfo, CiUser } from "react-icons/ci";
import { FaArrowRight } from 'react-icons/fa';

export default function App() {

  const [profile, setProfile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [error, setError] = useState(null);
  const [fans, setFans] = useState(null);
  const [engagements, setEngagements] = useState(null);
  const [impressions, setImpressions] = useState(null);
  const [reactions, setReactions] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    since: getCurrentDate(),
    until: getCurrentDate(),
    period: 'day',
  });

  const getPages = async ()=>{
    // console.log(accessToken)
    const response = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${profile?.accessToken}`);
    const data = await response.json();
    setPages(data.data);
    console.log(data);
  }

  const handleLogin = (response)=>{
    setProfile(response);
    console.log(response);
  }

  const handleSelectPage = (page)=>{
    setSelectedPage(page);
    setFans(null);
    setEngagements(null);
    setImpressions(null);
    setReactions(null);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredPages = pages?.filter((page) =>
    page?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted with:', formData);
    
    
    async function fetchdata(setType, metric){
      var url = `https://graph.facebook.com/v20.0/${selectedPage.id}/insights`;
      url += `?metric=${metric}`;
      url += `&period=${formData.period}`;
      url += `&since=${formData.since}`;
      url += `&until=${formData.until}`;
      url += `&access_token=${selectedPage.access_token}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            // console.log(data);
            if(data?.error)
            {
              setError(data?.error?.message);
            }
            else
            {
              setError(null);
              const values = data?.data[0]?.values;

              if(metric==='page_actions_post_reactions_total')
              {
                // console.log(values);
                var ans = 0;
                
                values.map((x)=>{
                  x?.value?.like ? ans+=x?.value?.like : '';
                  x?.value?.love ? ans+=x?.value?.love : '';
                  x?.value?.wow ? ans+=x?.value?.wow : '';
                  x?.value?.haha ? ans+=x?.value?.haha : '';
                  x?.value?.sorry ? ans+=x?.value?.sorry : '';
                  x?.value?.angry ? ans+=x?.value?.angry : '';
                })

                console.log(ans)
                setType(ans);
              }
              else
              {
                // console.log(values)
                var ans = 0;
                values.map((x)=>{
                  ans+=x.value;
                })
                // console.log(ans)
                setType(ans);
              }
                
            }
          })
          .catch(error => console.error('Error fetching data:', error));
    }

    fetchdata(setFans,'page_fans') 
    fetchdata(setEngagements,'page_post_engagements') 
    fetchdata(setImpressions,'page_impressions') 
    fetchdata(setReactions,'page_actions_post_reactions_total') 
   
    console.log(selectedPage)

  };


  useEffect(() => {
    if (profile) {
      getPages();
    }
  }, [profile]);

    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
          <a className="flex items-center gap-2 font-semibold" href="#">
            <CiUser />
            <span>User Profile</span>
          </a>
        </header>
        <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-10 gap-8">
            <div className="col-span-3 bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-24 h-24">
                  <img src={profile?.picture?.data?.url}/>                
                </span>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                </div>
              </div>
              <div className='flex justify-center'>
                <FacebookLogin
                  appId="412919185062810"
                  fields="name,email,picture"
                  callback={handleLogin}
                  scope="pages_show_list, pages_read_engagement, read_insights"
                  cssClass="my-8 px-8 py-4 shadow justify-center items-center text-white bg-sky-600 hover:bg-sky-800 rounded-lg"
                />
              </div>

              {profile && (
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Pages</h3>
                <input type="text" placeholder="Search pages..." value={searchQuery} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded-md w-full" />

                <ul className="space-y-2">

                  {filteredPages?.map((page, index) => (
                    <li key={index} className='bg-slate-50 hover:bg-slate-200 rounded-lg'>
                      <div
                        className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {handleSelectPage(page)}}
                      >
                        <div>
                          <h4 className="font-semibold">{page?.name}</h4>
                          <p className="text-muted-foreground">{page?.category}</p>
                        </div>
                        <FaArrowRight />
                      </div>
                    </li>
                  ))}

                </ul>
              </div>
              
              )}

            </div>

            <div className="col-span-7 bg-white rounded-lg shadow p-6 space-y-4">
              
            {selectedPage && (
              <div>
              <h2 className="text-2xl mb-4 font-bold">Page Details</h2>
              
              <div className="grid gap-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                      {selectedPage?.name}
                    </h2>
                    <h3 className="text-md text-muted-foreground">{selectedPage?.category}</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="items-end p-4 mx-4 grid gap-2 grid-cols-4 rounded-lg border bg-card text-card-foreground shadow-sm mb-4" data-v0-t="input-card">
                      <div className="flex flex-col">
                        <label htmlFor="since" className="font-semibold">Since</label>
                        <input type="date" id="since" name="since" className="border rounded p-2" value={formData.since} onChange={handleChange} />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="until" className="font-semibold">Until</label>
                        <input type="date" id="until" name="until" min={formData.since} className="border rounded p-2" value={formData.until} onChange={handleChange}/>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="period" className="font-semibold">Period</label>
                        <select id="period" name="period" className="border rounded p-2 h-11" value={formData.period} onChange={handleChange}>
                          <option value="day">Day</option>
                          <option value="week">Week</option>
                          <option value="days_28">Days_28</option>
                        </select>
                      </div>
                      <button type="submit" className=" bg-sky-700 hover:bg-sky-900 h-10 text-white font-semibold px-4 rounded-xl ml-auto">
                        Apply
                      </button>
                  </form>

                  {error && (
                    <div className="flex items-center p-4 m-8 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                    <CiCircleInfo />
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>

                  )}
                  
                  {!error && (
                    <div className="p-12 text-center grid gap-2">
                      <div className="flex items-center text-lg justify-between font-semibold">
                        <span >Total Fans:</span>
                        <span>{fans}</span>
                      </div>
                      <div className="flex items-center text-lg justify-between font-semibold">
                        <span className="font-semibold">Total Engagement:</span>
                        <span>{engagements}</span>
                      </div>
                      <div className="flex items-center text-lg justify-between font-semibold">
                        <span className="font-semibold">Total Impressions:</span>
                        <span>{impressions}</span>
                      </div>
                      <div className="flex items-center text-lg justify-between font-semibold">
                        <span className="font-semibold">Total Reactions: </span>
                        <span>{reactions}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
              </div>
            )}

            </div>
          
          </div>
        </main>

        <footer className="px-4 py-5 shadow bottom-0 w-full bg-white border-t sticky ">
        </footer>


      </div>
    );
  };
  