import { Switch } from "react-router-dom";
// import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import { AuthRoute } from "./components/Routes/Routes";

import SplashPage from "./components/SplashPage/SplashPage";
import Navigation from "./components/Navigation/Navigation";

function App() {
	return (
		<>
			<Navigation />
			<SplashPage />

			{/* <Switch>
				<Route exec path="/" component={Map} />
			</Switch> */}
		</>
	);
}

export default App;
