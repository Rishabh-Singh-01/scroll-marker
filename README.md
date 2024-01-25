### Scroll Marker

A small chrome extension to mark different scroll points in a webpage.

#### Motivation

To be able to easily bookmark some point in a webpage mainly blogs, books and documentation, making it super easy to come back again even after complete restart of the browser (like coming back in few days)

#### Progress

This is still in dev phase.

#### Bugs

- Open two different windows with two different sites now open both window popups and now save on tab/window view, we will see the popup ui gets updated of the other one as well. now close the both the and open and show the markers, we wil see the correct markers are registered in first one and no extra are registered in second one. this means our logic to store in storage is okay but ui is getting synced incorrectly.
  - Point is whenever the storage for any url gets updated it triggers the event which is captured by all the chrome instances and thus ui gets re-render with the new event updated details from the storage.
  - potential fix could be check which instance of chrome extension is opened and then not updating all the instances which are not needed
  - other fix could be just to re-render but via fetching the details as per storage
  - tho both the fixed above have some issues and could only be rectified only after a look
