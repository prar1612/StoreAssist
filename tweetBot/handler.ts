import fetch from 'node-fetch';
import Twit = require('twit');
import { parse, format } from 'fecha';

const URL = 'https://spreadsheets.google.com/feeds/list/1OZbJNVLZ9TMXs6wJgAJfXFUGvtq2ZICzl7Vyr-gEH_8/od6/public/values?alt=json';

const T = new Twit({
    consumer_key:         '--consumerkey--',
    consumer_secret:      '--consumersecret--',
    access_token:         '--accesskey--',
    access_token_secret:  '--accesssecret--'
  });

// convert Google sheets date string to javascript Date object
const cellToDate = (str: string): Date => parse(`${str} -0500`, 'YYYY-MM-DD HH:mm:ss ZZ') as Date;
const formatDate = (d: Date): string => format(d, 'MMM Do @ h:mm:ssA');
const parseDate = (str: string): Date => parse(`${str} -0800`, 'MMM Do @ h:mm:ssA ZZ') as Date;

// Generate text for status
const postToStatus = (post: any): string => `OfferDate: ${formatDate(cellToDate(post.gsx$offerdate.$t))} 
Offer: ${post.gsx$offer.$t}`;


export const tweet = async () => {

// All postings
const arr = await fetch(URL)
.then(r => r.json())
.then(obj => obj.feed.entry);

console.log('\n arr_sent:', arr);

// Date of most recent tweeted post
const previousDate = await T.get('statuses/user_timeline', { screen_name: 'ManasiPai', count: 1 })
.then((r: any) => r.data[0].text.split('\n')[0].replace('OfferDate: ', ''))
.then(parseDate)
.then(res => res || new Date('2018-11-17'))
.catch(() => new Date('2018-11-10'));

console.log('\n previousDate:', previousDate);

// Postings added since last tweet
const newPostings = arr.find(
(post: any) =>
    post.gsx$offerdate.$t &&
    cellToDate(post.gsx$offerdate.$t) > previousDate
);

   // for (const post of newPostings) {
       const post = newPostings;
       console.log('\n post:', post);
        const status = postToStatus(post);
        await T.post('statuses/update', { status: status })
            .then((res: any) => console.log('\n Data:', res.data.id))
            .catch((err: Error) => console.log('\n Error:', err.message));
  //  }

            
   
       
  
   
};

