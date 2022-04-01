// import { StyledEngineProvider } from "@mui/material/styles";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import Home from "../routes/home";
import NotFoundPage from "../routes/notfound";
import Races from "../routes/races";
import Results from "../routes/results/";
import Scoring, { RacesList } from "../routes/scoring/Scoring";
import Upload from "../routes/upload";
import { AuthRoute } from "../util/AuthenticatedRoute ";
import Footer from "./footer";
import Header from "./header";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

const App: FunctionalComponent = () => (
  <ChakraProvider resetCSS theme={theme}>
    <div id="preact_root">
      <Header />
      <div class="page">
        <Router>
          <Route path="/" component={Home} />
          <AuthRoute path="/races/:race" component={Races} />
          <AuthRoute path="/upload" component={Upload} />
          <Route path="/results" component={Results} />
          <AuthRoute
            path="/results/:seriesid/:raceid"
            component={(props) => <Results {...props} />}
          />
          <AuthRoute path="/scoring" component={Scoring} />
          {/* <AuthRoute path="/scoring/:seiresid/" component={RacesList} /> */}

          <NotFoundPage default />
        </Router>
      </div>
      <Footer />
    </div>
  </ChakraProvider>
);

export default App;
