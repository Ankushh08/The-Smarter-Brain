import './App.css';
import { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import 'tachyons'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecoganition from './Components/FaceRecoganition/FaceRecoganition';
// import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import SignIn from './Components/SignIn/SignIn';
const Clarifai = require('clarifai');


/*
  This is just initiating the Clarifai API....
*/
const app = new Clarifai.App({
  apiKey: '4922ecc14d84469185d57a4bdcb7ad1f'
});

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    // password: '', 
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = initialState; 
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        // password: data.id, 
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  onInputChange = (event) => {
    // console.log(event.target.value);
    this.setState({ input: event.target.value });
  }


  calculateFaceLocation = (data) => {

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    // console.log(clarifaiFace);
    // console.log(image);
    const width = Number(image.width);
    const height = Number(image.height);

    // console.log(width, height, 'OKK!!'); 
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box })
  }


  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        // console.log(this.state.imageUrl);

        // console.log('click');
        // Implementing the Clarifai Api......

        // Yaha par agar ImageUrl use karte toh error aata
        // Acc to Mentor, this is an advance React Concept apparently....
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        // console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              console.log(count);
              this.setState(Object.assign(this.state.user, { entries: count }))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }


  onRouteChange = (inputRoute) => {
    if (inputRoute === 'signout') {
      this.setState(initialState);
    } else if (inputRoute === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: inputRoute });
  }


  render() {
    return (
      <div className="App" >
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {
          this.state.route === 'home' ?
            <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecoganition
                box={this.state.box}
                imageUrl={this.state.imageUrl}
              />
            </div> : (
              this.state.route === 'signin'
                ? <SignIn
                  loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange} />
                : <Register
                  loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
