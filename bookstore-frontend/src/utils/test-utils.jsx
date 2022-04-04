import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore } from 'redux/store'
import { Provider } from 'react-redux'

function render(
  ui,
  {
    preloadedState,
    store = configureStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }