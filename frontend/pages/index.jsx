import fetch from "isomorphic-unfetch";
import Layout from "../components/MyLayout";
import Review from "../components/Review"; // review is the child component to load each review
import Stars from "../components/stars";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Badge } from "react-bootstrap";
import { CardColumns } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

class Index extends React.Component {
  render() {
    return (
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

        <h1>Top 5 {this.props.term}</h1>
        <h5>in {this.props.location}</h5>
        <CardColumns>
          {this.props.shops.map(shop => (
            <Card bg="light" key={shop.id}>
              <Card.Header>
                <a
                  href={shop.url}
                  target="blank"
                  className="text-danger font-weight-bold"
                >
                  {shop.name}
                </a>{" "}
                <Badge pill variant="secondary">
                  {shop.price}
                </Badge>
              </Card.Header>
              <figure>
                <img src={shop.image_url} alt={shop.alias} />
              </figure>
              <Card.Body>
                <Stars shopStars={shop.rating}></Stars>
                <a> {shop.review_count} Reviews </a>

                <address className="small text-muted">
                  {shop.location.address1 +
                    ", " +
                    shop.location.city +
                    " " +
                    shop.location.state}
                </address>
                <Review shopId={shop.id}></Review>
              </Card.Body>
              <Card.Footer>
                <Button
                  block
                  className="pull-right"
                  size="sm"
                  variant="secondary"
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
              </Card.Footer>
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
                <Button block variant="danger" type="submit">
                  Find
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </CardColumns>
      </Layout>
    );
  }
}

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
    (params.formLocation = "Alhparetta,GA"), (params.formShop = "Burger");
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
