import axios from "axios";

const reloadWebsite=()=> {
    axios.get(process.env.WEBURL)
      .then(response => {
        console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
      })
      .catch(error => {
        console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
      });
  }
  
  export default reloadWebsite