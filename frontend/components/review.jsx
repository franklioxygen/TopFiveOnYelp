import React from "react";

class Review extends React.Component {
  state = {
    loaded: false,
    review: null
  };
  async componentDidMount() {
    await fetch(
      "http://" +
        window.location.hostname +
        ":8080/reviews/?id=" +
        this.props.shopId
    )
      .then(json => json.json())
      .then(data => {
        this.setState({ review: data, loaded: true });
      });
  }
  render() {
    const ready = this.state.loaded;
    return ready ? (
      <blockquote className="small">
        {this.state.review.user.name}:{" "}
        <span className="font-italic">
          {this.state.review.text.slice(0, 80)}...{" "}
          <a href={this.state.review.url}>Read More</a>{" "}
        </span>
      </blockquote>
    ) : (
      "loading"
    );
  }
}

export default Review;
