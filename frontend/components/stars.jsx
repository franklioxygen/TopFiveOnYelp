import React from "react";
const round = shopStars => {
  let res = 0;
  switch (true) {
    case shopStars <= 1.4:
      res = 1;
      break;
    case shopStars <= 2.4:
      res = 2;
      break;
    case shopStars <= 3.4:
      res = 3;
      break;
    case shopStars <= 4.4:
      res = 4;
      break;
    case shopStars <= 5:
      res = 5;
      break;
    default:
      break;
  }
  return res;
};

class Stars extends React.Component {
  render() {
    return (
      <img
        alt={this.props.shopStars}
        src={
          "/static/img/regular_stars/regular_" +
          round(this.props.shopStars) +
          ".png"
        }
      ></img>
    );
  }
}

export default Stars;
