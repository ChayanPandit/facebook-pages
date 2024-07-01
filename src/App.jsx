
import {LoginSocialFacebook} from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'
import FacebookLogin from 'react-facebook-login';
import { useEffect, useState } from 'react'

export default function App() {

  const [profile, setProfile] = useState(null);

  useEffect(()=>{
    
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '412919185062810',
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0'
      });
      FB.AppEvents.logPageView();   
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    
  },[])


  return (
    <div>
      <FacebookLogin
      appId="412919185062810"
      fields="name,email,picture"
      callback={(response)=>{
        setProfile(response)
        console.log(response)
      }}
      scope="pages_show_list, pages_read_engagement, read_insights"
      />

      {profile && (
        <div>
          <h3>
            {profile?.name}
          </h3>
          <h3>
            {profile?.email}
          </h3>
          <img src={profile?.picture?.data?.url}/>
        </div>
      ) }
    </div>
  )
}
