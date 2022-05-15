import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import Home from "../routes/home";
import NotFoundPage from "../routes/notfound";
import Races from "../routes/races";
import Results from "../routes/results/";
import Scoring from "../routes/Scoring";
import { ScoringSetUp } from "../routes/scoring/ScoringSetup";
import { RacesList } from "../routes/scoring/RacesList";
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
  gray: {
    "50": "#F0F2F4",
    "100": "#D6DAE0",
    "200": "#BCC3CC",
    "300": "#A2ABB9",
    "400": "#8894A5",
    "500": "#6E7C91",
    "600": "#586474",
    "700": "#424B57",
    "800": "#2C323A",
    "900": "#16191D",
  },
  teal: {
    "50": "#ECF8F8",
    "100": "#CBECEB",
    "200": "#A9DFDE",
    "300": "#88D3D1",
    "400": "#66C7C5",
    "500": "#45BAB8",
    "600": "#379593",
    "700": "#29706E",
    "800": "#1B4B4A",
    "900": "#0E2525",
  },
  blue: {
    "50": "#EAF2FA",
    "100": "#C6DCF1",
    "200": "#A1C5E8",
    "300": "#7CAFDF",
    "400": "#5798D6",
    "500": "#3282CD",
    "600": "#2868A4",
    "700": "#1E4E7B",
    "800": "#143452",
    "900": "#0A1A29",
  },
};

const theme = extendTheme({ colors });

const App: FunctionalComponent = () => (
  // I would like to have routes nested with AuthRoute
  // I would like to keep urls clean and be able to pass refs
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

          {/* Display RaceList */}
          <AuthRoute
            path="/scoring/:seriesid/"
            component={(props) => <RacesList {...props} />}
          />

          <AuthRoute
            path="/scoring/:seriesid/:raceid"
            component={(props) => <ScoringSetUp {...props} />}
          />

          <NotFoundPage default />
        </Router>
      </div>
      <Footer />
    </div>
  </ChakraProvider>
);

export default App;
