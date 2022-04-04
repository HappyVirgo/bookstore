import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import sagas from "./sagas";
import { composeWithDevTools } from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();

// const middlewares = [sagaMiddleware];

const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});

export function configureStore(initialState) {
    const store = createStore(
        reducers,
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware))
    );

    sagaMiddleware.run(sagas);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept("./reducers", () => {
            const nextRootReducer = require("./reducers");
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
