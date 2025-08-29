const backendUrl: urlTypes = {
    hostedURL:"https://sales-pitch-server.onrender.com/api/" ,
    baseURL:"http://localhost:5000/api/",
    flyURL:"https://sales-pitch-server.fly.dev/api/"
}


interface urlTypes {
    baseURL: string;
    hostedURL:string;
    flyURL:string;
  }

  export default backendUrl;