import React, { Component, Fragment } from 'react';
import './App.css';

export default class App extends Component {
  state = {
    movies: [],
    userInput: {
      movieTitle: '',
      producedBy: '',
      directedBy: '',
      leadActors: '',
      releaseDate: '',
      runTime: ''
    }
  }

  save = async () => {
    const movie = this.state.userInput

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies`, {
      method: movie._id ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(movie)
    })

    const successful = response.status === 201 || response.status === 200

    if (successful) {
      await this.getMovies()

      this.setState({
        userInput: {
          movieTitle: '',
          producedBy: '',
          directedBy: '',
          leadActors: '',
          releaseDate: '',
          runTime: ''
        },
        error: null
      })
    }
    else {
      const error = await response.json()

      this.setState({ error })

      console.log(error)
    }
  }

  movieTitleChanged = (event) => {
    this.setState({
      userInput: {
        ...this.state.userInput,
        movieTitle: event.target.value
      }
    })
  }

  producedByChanged = (event) => {
    this.setState({
      userInput: {
        ...this.state.userInput,
        producedBy: event.target.value
      }
    })
  }

  directedByChanged = (event) => {
    this.setState({
      userInput: {
        ...this.state.userInput,
        directedBy: event.target.value
      }
    })
  }

  leadActorsChanged = (event) => {
    this.setState({
      userInput: {
        ...this.state.userInput,
        leadActors: event.target.value
      }
    })
  }

  releaseDateChanged = (event) => {
    this.setState({
      userInput: {
        ...this.state.userInput,
        releaseDate: event.target.value
      }
    })
  }

  runTimeChanged = (event) => {
    this.setState({
      userInput: {
        ...this.state.userInput,
        runTime: event.target.value
      }
    })
  }

  editMovie = (event) => {
    const movieId = event.target.attributes.getNamedItem('movieid').value
    const targetMovie = this.state.movies.reduce((movieToEdit, movie) => {
      return movie._id === movieId ? movie : movieToEdit
    }, null)

    if (targetMovie) {
      this.setState({
        userInput: targetMovie
      })
    }
  }

  deleteMovie = async (event) => {
    const movieId = event.target.attributes.getNamedItem('movieid').value

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/${movieId}`, {
      method: 'DELETE',
      mode: 'cors'
    })

    const successful = response.status === 200

    if (successful) {
      await this.getMovies()
    }
  }

  renderError = () => {
    return this.state.error
      ? (<div>{this.state.error.message}</div>)
      : (<Fragment />)
  }

  renderMovies = () => {
    return this.state.movies.map((movie) => {
      return (
        <div key={movie._id}>
          <button movieid={movie._id} onClick={this.editMovie}>{movie.movieTitle}</button>
          <button movieid={movie._id} onClick={this.deleteMovie}>(delete)</button>
        </div>
      )
    })
  }

  getMovies = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'accept': 'application/json'
      }
    })

    const successful = response.status === 200

    if (successful) {
      const movies = await response.json()
      this.setState({ movies })
    }
    else {
      console.log(response)
    }
  }

  componentDidMount() {
    this.getMovies()
  }

  render() {
    return (
      <div className="crud-area">
        <section>
          <h2>MOVIES</h2>
          <div>
            {this.renderMovies()}
          </div>
        </section>
        <main>
          <h2>NEW MOVIE</h2>
          <div>
            <label htmlFor="title-input">Title:</label>
            <input id="title-input" type="text" value={this.state.userInput.movieTitle} onChange={this.movieTitleChanged} />
          </div>
          <div>
            <label htmlFor="producedBy-input">Produced By:</label>
            <input id="producedBy-input" type="text" value={this.state.userInput.producedBy} onChange={this.producedByChanged} />
          </div>
          <div>
            <label htmlFor="directedBy-input">Directed By:</label>
            <input id="directedBy-input" type="text" value={this.state.userInput.directedBy} onChange={this.directedByChanged} />
          </div>
          <div>
            <label htmlFor="leadActors-input">Lead Actors:</label>
            <input id="leadActors-input" type="text" value={this.state.userInput.leadActors} onChange={this.leadActorsChanged} />
          </div>
          <div>
            <label htmlFor="releaseDate-input">Release Date:</label>
            <input id="releaseDate-input" type="text" value={this.state.userInput.releaseDate} onChange={this.releaseDateChanged} />
          </div>
          <div>
            <label htmlFor="runTime-input">Run Time:</label>
            <input id="runTime-input" type="text" value={this.state.userInput.runTime} onChange={this.runTimeChanged} />
          </div>
          {this.renderError()}
          <button onClick={this.save}>Save</button>
        </main>
      </div>
    );
  }
}


