import fetch from "isomorphic-unfetch";
import Layout from "../components/MyLayout";
import Review from "../components/Review"; // review is the child component to load each review
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Badge } from "react-bootstrap";
import { CardColumns } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

const Index = props => (
  <Layout>
    <style jsx>{`
      h1,
      h5 {
        text-align: center;
      }
      figure img {
        display: block;
        width: 100%;
        object-fit: cover; /* Do not scale the image */
        object-position: center; /* Center the image within the element */
        height: 150px;
        width: 100%;
      }
    `}</style>

    <h1>Top 5 {props.term}</h1>
    <h5>in {props.location}</h5>
    <CardColumns>
      {props.shops.map(shop => (
        <Card bg="light" key={shop.id}>
          <Card.Header>
            <a href={shop.url} target="blank">
              {shop.name}
            </a>
          </Card.Header>
          <figure>
            <img src={shop.image_url} alt={shop.alias} />
          </figure>
          <Card.Body>
            <a>Rating: {shop.rating} </a>
            <a>Reviews: {shop.review_count} </a> <a>Price: </a>
            <Badge pill variant="info">
              {shop.price}
            </Badge>
            <address class="small">
              Address:{" "}
              {shop.location.address1 +
                ", " +
                shop.location.city +
                " " +
                shop.location.state}
            </address>
            <Review shopId={shop.id}></Review>
            <Button
              variant="success"
              href={
                "https://www.google.com/maps/place/" +
                shop.location.address1 +
                " " +
                shop.location.city +
                " " +
                shop.location.state
              }
              target="blank"
            >
              Let's Go!
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Card>
        <Card.Body>
          <Form method="get">
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="formLocation"
                required
              />
            </Form.Group>
            <Form.Group controlId="formShop">
              <Form.Label>Shop</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Shop Type"
                name="formShop"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Find
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </CardColumns>
  </Layout>
);

const getJsonFromUrl = url => {
  if (!url) url = location.search;
  const query = url.substr(2);
  const result = {};
  query.split("&").forEach(function(part) {
    const item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
};

// 'getInitialProps' is nexjs builtin fucntion

Index.getInitialProps = async ({ req }) => {
  const params = getJsonFromUrl(req.url);
  if (params.formLocation == undefined) {
    (params.formLocation = "Alhparetta,GA"), (params.formShop = "Ice Cream");
  }
  const res = await fetch(
    "http://localhost:8080?location=" +
      params.formLocation +
      "&term=" +
      params.formShop
  );
  const data = await res.json();
  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shops: data.map(entry => entry),
    // pass params to title
    location: params.formLocation,
    term: params.formShop
  };
};

export default Index;
