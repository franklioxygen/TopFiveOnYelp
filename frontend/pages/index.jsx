import fetch from "isomorphic-unfetch";
import Layout from "../components/MyLayout";
import Review from "../components/Review";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
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
          <figure>
            <img src={shop.image_url} alt={shop.alias} />
          </figure>
          <Card.Body>
            <Card.Title>
              <a href={shop.url} target="blank">
                {shop.name}
              </a>
            </Card.Title>
            <Card.Text>
              <a>Rating: {shop.rating} </a>
              <a>Reviews: {shop.review_count} </a> <a>Price: {shop.price} </a>
              <n />
              <small>
                <p>
                  Address:{" "}
                  {shop.location.address1 +
                    ", " +
                    shop.location.city +
                    " " +
                    shop.location.state}
                </p>
              </small>
            </Card.Text>
            <Card.Text>
              <p>
                <Review shopId={shop.id}></Review>
              </p>
            </Card.Text>
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

function getJsonFromUrl(url) {
  if (!url) url = location.search;
  var query = url.substr(2);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

Index.getInitialProps = async function({ req }) {
  let params = getJsonFromUrl(req.url);
  if (params.formLocation == undefined) {
    (params.formLocation = "Alhparetta,GA"), (params.formShop = "Ice Cream");
  }
  const res = await fetch(
    "http://localhost:8080?location=" +
      params.formLocation +
      "&term=" +
      params.formShop
  );
  let data = await res.json();
  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shops: data.map(entry => entry),
    location: params.formLocation,
    term: params.formShop
  };
};

export default Index;
