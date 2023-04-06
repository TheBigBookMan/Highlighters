# Highlighters

This is a social media application where users post highlight events of a specific timeframe (daily, weekly, monthly, yearly). It encourages users to think back to moments that stood out as positive so they can post it as their highlight.

## Introduction

This application allows users to follow other users and be followed back, which then gives the user the ability to see who they are following posts as well as others see their posts from following them. How the timeframe posting works: A user can only make one post a day on the 'daily' timeframe, after a week the user can look back at the 7 'daily' posts and then choose the one which stood out the most as a highlight and select that as their 'weekly' post. Then at the end of the month the user can select one of the 4 'weekly' posts for their month, and end of the year choose one of the 12 'monthly' posts for their 'yearly' post. The idea of the application is that users have to look over their previous highlights they have had recently and then choose the one that stands out the most based on the timeframe. This is a great application for people who want to record nice moments in their life and be able to constantly be reminded of their own life highlights.

## Technologies

Typescript/Javascript, ReactJS/NextJS13, NodeJS, FireBase, GoogleAuth, GoogleCloud, TailwindCSS, Vercel, React packages.

## Deployed URL

https://highlighters.vercel.app/

## GitHub Repo

https://github.com/TheBigBookMan/highlighters

## Functionality

### Initialization

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Navbar

The navbar contains the navigation to the pages: Profile, Newsfeed, Friends. It also contains the search bar. When the application is in a mobile phone layout, the navbar is in a dropdown menu from the hero icon in the top-right corner.

### User Authentication

Users are able to login with their gmail account on the login page. Once the user logs in with their gmail, only the email, googleId and image are saved to the actual Firebase database of the application.

### Newsfeed

The newsfeed is the main location for the user to view posts made by the people they are following. On the newsfeed the user can view the different timeframes for the posts: all, daily, weekly, monthly and yearly. The user can also filter the posts by: most recent, least recent, most liked and least liked. A user can click on a post to go to that posts page directly. Each post displays the image, title, description, location, date uploaded, name of person uploaded, comment amount and likes amount.

### MyProfile

The user can view their own profile on the Profile page.

#### MyBio

In the Bio section is the users profile picture (which was imported through their gmail account when logging in). They can also set a description that others can see if they would like to.

#### MyPosts

The user can view the posts they have created as well, selecting to view by timeframes: daily, weekly, monthly and yearly. Clicking on one of the posts will take the user to more information about that post. Each post displays the image, title, description, location, date uploaded, comment amount and likes amount.

### UserProfile

The user can view other users profiles.

#### UserBio

The users bio has their picture (imported from their gmail when logging in), the description they set for themselves, and there is also a "Follow" or "Unfollow" button.

#### UserPosts

The user can view that users posts, selecting by the timeframes: daily, weekly, monthly and yearly. Each post displays the image, title, description, location, date uploaded, comment amount and likes amount.

### CreatePost

If a user wants to create a post they can go to the Post page.

#### Form

On the form, the user will have to add an image from their local drive and click "Upload" for that image to be added to the database. The user must fill out the title section, while the description, location, friends are optional. The user can select the timeframe they would like to upload to. The timeframe to upload to may be disabled depending on the cooldown for their timeframe upload availability.

#### UsePost

If the user would like to use an older post from a different timeframe to upload to a newer timeframe, they can in the bottom section. The user must select from a older timeframe, then select which post and then select which timeframe to upload to. The timeframe to upload to may be disabled depending on the cooldown for their timeframe upload availability.

#### Timeframe Functionality

The timeframe functionality is that it allows the user to only make a post once per day (daily), once per week (weekly), once per month (monthly) and once per year (yearly). The timers start as soon as the user creates their account and will be reset once those timeframes end: daily (11:59pm each night resets), weekly (11:59pm each Sunday night resets), monthly (11:59pm the last day of the month resets), yearly (December 31 11:59pm resets). The functionality only starts a cooldown, once the post for that timeframe has been triggered. For example: if the user posts on the weekly on a Thursday, then they will still have to wait until Sunday 11:59pm, and can then post on any day of the week until the next Sunday 11:59pm. This usecase is so users have to think hard about what was a highlight for them and be able to reflect positively on all their previous posts.

### Friends

The user can access the friends page by clicking on Friends.

#### Followers

The user will have a list of all the users that are following them. The user will be able to see their hero image, name and description. As well as the ability to click on the follow and unfollow buttons for those users.

#### Following

The user will have a list of all the users they follow. Displaying the hero image, name and description. The user can unfollow them from this page, but when they click the unfollow button, that user will be removed from the following page because the user isn't currently following them anymore.

### Search

In the navigation there is a search bar. The user can type in another users name and click the search button. This will go to a search page where there will be a list of all the users that match the searched keywords. The user can then click on those users names and be directed to the users profile page.
