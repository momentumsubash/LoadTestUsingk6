import { check, sleep, group } from "k6";
import { Rate } from "k6/metrics";
import http from "k6/http";


export let options = {

  //baseline testing

  stages: [
    { target: 10, duration: '1m' },
    // { target: 50, duration: '10m' },
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




export default function () {
  var baseUrl = 'https://asg-api.the5dots.com/api';
  group('v1 API testing', function () {
    group('Event Testing', function () {


      var url = baseUrl + '/events';
      var payload = JSON.stringify({
        "itemId": "1224",
        "eventType": "visit",
        "eventData": {},
        "dfp": "test fingerprint subash",
        "deviceType": "mac",
        "timestamp": "1584425873",
        "page": "homepage"
      });

      var params = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWU3NWM1MDE4NDU1MjkwMDU4MzE0OWU3IiwiaWF0IjoxNTg0OTQ2MDA4LCJleHAiOjE1ODU1NTA4MDh9.4D5D6RJmOZvNfRvzC9LTZb9S2uLmUOKzVn9ok-TPar0'
        },
      };


      var res = http.post(url, payload, params);
      check(res, {
        'status was 200': r => r.status == 200,
        'transaction time OK': r => r.timings.duration < 200,
      });


    });

    group('List Article', function () {
      var id = "5911582151577973448" // from postman
      let res = http.get(baseUrl + "/article/" + id + "/keywords?language=en", {
        headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWU3NWM1MDE4NDU1MjkwMDU4MzE0OWU3IiwiaWF0IjoxNTg0OTQ2MDA4LCJleHAiOjE1ODU1NTA4MDh9.4D5D6RJmOZvNfRvzC9LTZb9S2uLmUOKzVn9ok-TPar0" }
      });
      check(res, {
        "status is 200": (r) => r.status === 200,
        //"response": (r) => r.json()["authenticated"] === true
      });
    });

    group('Search endpoint test', function () {
      let res = http.get(baseUrl + "/search?q=test&item_type=video&size=500&page=1");
      check(res, {
        "status is 200": (r) => r.status === 200,
        /
      });
    });
  });
  sleep(1);
}