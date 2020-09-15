# sample-Lovevery-homework
A sample assignment for my Lovevery application.  
You can see it live at https://scottrippey.github.io/sample-Lovevery-homework/  
You can run it locally by running `npm install` then `npm run dev`

# About this Project

![Animated Screenshot](https://user-images.githubusercontent.com/430608/93270266-fad54c00-f76d-11ea-9dde-28c8e516fac2.gif)

## Tech Stack
For the tech stack, I chose **React** and **TypeScript**, with a **Parcel** bundler. Since the UI style was not specified, I used the **Material UI** library, with minimal use of **Tailwind CSS** too.  To interface with the REST API, I considered using just raw `fetch`, but wanted to give **Axios** a try.  And finally, I used **Jest** for the unit tests, along with **React Testing Library**.

## Implementing a REST API client

Knowing I would use React hooks, I first investigated some REST hooks like `useFetch`.But I really disliked how closely coupled the UI and client logic were.  
Instead, I created a standalone `messagesClient`, which wrapped the server side logic, (including client-side logic like parsing the JSON body).  
Then, to connect this client to the UI, I used a generic `useAsync` hook. This worked wonderfully, kept the UI clean, and could easily apply to other async logic (not just `fetch` requests).

## CORS workaround

One problem, found early on, was that the REST API was not responding with CORS headers, so my static app was blocked from accessing the API. As a short term workaround, I disabled my browsers security settings.  
However, I quickly decided on a better solution! I decided to create a "mock server" using `axios-mock-adapter`, which intercepts client-side requests, and simulates the spec of the actual REST API.  
The biggest advantage of this approach: I was already planning on doing it!  This "mock server" is a perfect utility for unit tests, so by adding a mock server, I was able to easily add unit tests for the `messagesClient` too.  It also allowed me to simulate "latency" on the requests, so I could easilly test my loading states.

## Automated Testing

For this project, I wanted to showcase my love for automated testing, so I was sure to add some basic **unit tests**.  
To test the `messagesClient`, I first created a mock server (using `axios-mock-adapter`) that simulated the endpoints of the actual REST API.  This worked wonderfully, and I got decent coverage of that client.  
Whenever I write unit tests, I try really hard to create a "sandbox" environment -- where I mock any external dependency, so that I can test my code end-to-end.  So, by mocking the REST API, I can reuse that mock for my UI too!
So, I added a `MessagesList` test, using React Testing Library.  The mock data loads and populates the UI, so it was really easy to test.

## Manual Testing Plan

The unit tests cover the main use-cases, but are pretty limited.  I was not attempting to get 100% coverage.  
So, here's a manual testing plan. 

Once the page is loaded:

Messages List: 
1. Ensure a "Loading messages..." message is shown while the list is first loading
2. Ensure all users are displayed on the page
3. Ensure all messages are shown for each user

Add Message:
1. Enter a user name, subject, and message; click Add (or press Enter) and verify that the message gets added to the server
2. Verify that the messages refresh, and the new message has been added to the correct user
3. Ensure that the User field is not case-sensitive when adding messages
4. Ensure that the User, Subject, or Message fields can be blank, and can still be submitted (perhaps this could be considered a bug?)
