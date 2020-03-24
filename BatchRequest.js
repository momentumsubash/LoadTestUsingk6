import http from 'k6/http';
import { check } from 'k6';

export let options = {

  stages: [
    { target: 2, duration: '1s' },
    // { target: 50, duration: '1m' },
    // { target: 0, duration: '1m' },
  ],

  // for load test
  // stages: [
  //     { target: 2000, duration: '5m' },
  //     { target: 2000, duration: '15m' },
  //     { target: 0, duration: '5m' },
  //   ],

  // for spike - simulate the intensity
  // stages: [
  //   { target: 2000, duration: '1m' },
  //   { target: 2000, duration: '5m' },
  //   { target: 10000, duration: '3m' },
  //   { target: 10000, duration: '5m' },
  //   { target: 0, duration: '5m' },
  // ],
  thresholds: {
    requests: ['count < 100'],
    errors: ["rate<0.1"], // <10% error rate to set a threshold or use count<10 or some thing
  },

};

export default function() {
  var baseUrl = 'https://asg-api.the5dots.com/api';
  
  var article_id="5911582151577973448"; // prom postman

  let requests = {
    
    'search Endpoint': {
      method: 'GET',
      url: baseUrl+"/search?q=test&item_type=video&size=500&page=1",


      //body is optional is you are sending some data in post method
      // body: {
      //   'item id': ' some id'
      // }
      params: { 
        headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWU3NWM1MDE4NDU1MjkwMDU4MzE0OWU3IiwiaWF0IjoxNTg0OTQ2MDA4LCJleHAiOjE1ODU1NTA4MDh9.4D5D6RJmOZvNfRvzC9LTZb9S2uLmUOKzVn9ok-TPar0" }
       },
    },

    'List Article Endpoint': {
      
      method: 'GET',
      url: baseUrl+"/article/"+article_id+"/keywords?language=en",


      //body is optional is you are sending some data in post method
      // body: {
      //   'item id': ' some id'
      // }
      params: { 
        headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWU3NWM1MDE4NDU1MjkwMDU4MzE0OWU3IiwiaWF0IjoxNTg0OTQ2MDA4LCJleHAiOjE1ODU1NTA4MDh9.4D5D6RJmOZvNfRvzC9LTZb9S2uLmUOKzVn9ok-TPar0" }
       },
    },


  };
  let responses = http.batch(requests);
  // when accessing results, we use the name of the request as index
  // in order to find the corresponding Response object
  check(responses['search Endpoint'], {
    'Search page status was 200': res => res.status === 200,
  });

  check(responses['List Article Endpoint'], {
    'List Article status was 200': res => res.status === 200,
  });
}