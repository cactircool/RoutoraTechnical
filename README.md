# Routora technical github

This is a simple todo list app with locations attached to each todo item. The app dynamically uses and updates information from a firebase backend.

The idea is that each todo list item can also have a location attached so that items can be seen on the map as clusters. Clicking on an item opens a slide up modal to update information, complete, or delete the item.

The second page is a list page which lists all completed and incomplete todolist items ordered by their proximity to the current location. (Note that a simulator's current location (at least on mac) is either in (Apple/Google) HQ, or a random spot in the Pacific Ocean)

This app also uses user authentication with usernames and passwords. Currently registration requires an email and phone number as well, but I had no use for that other than future proofing for something like a newsletter or reminder text.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).