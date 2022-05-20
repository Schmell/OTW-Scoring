import { FunctionalComponent, h } from "preact"
import Router, { Route } from "preact-router"
import Home from "../routes/home"
import New from "../routes/new"
import Results from "../routes/results"
import Scoring from "../routes/Scoring"
import { RacesList } from "../routes/scoring/RacesList"
import { RaceProperties} from "../routes/scoring/RaceProperties"
import Upload from "../routes/upload"
import { AuthRoute } from "../util/AuthenticatedRoute "
import NotFoundPage from "../routes/notfound";
import { StateUpdater } from "preact/hooks"

interface IRouting {
    
    [x: string | number]: any;
}
const Routing: FunctionalComponent<IRouting> = (props)=>{
// console.log(props);
    return (
        <Router>
          <Route path="/" component={Home} {...props}/>
          <Route path="/new" component={New} {...props} />
          {/* <AuthRoute path="/races/:race" component={Races} {...props} /> */}
          <AuthRoute path="/upload" component={Upload} {...props} />
          <Route path="/results" component={Results} {...props} />
          {/* <AuthRoute
            path="/scoring"
            component={(props) => <Scoring {...props} />}
          /> */}
          <AuthRoute path="/scoring" component={Scoring} {...props} />
          {/* <Scoring path="/scoring" {...props} /> */}
          <AuthRoute path="/race-properties" component={RaceProperties} {...props} />
          {/* Display RaceList */}
          <AuthRoute
            path="/scoring/:seriesid/"
            component={(props) => <RacesList {...props} />}
          />
          <Route path="/races" component={RacesList} {...props} />

          {/* <AuthRoute
            path="/scoring/:seriesid/:raceid"
            component={(props) => <ScoringSetUp {...props} />}
          /> */}

          <NotFoundPage default />
        </Router>
    )
}
export default Routing