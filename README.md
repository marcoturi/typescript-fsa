# FORK of Typescript-FSA

This fork implement a 4th argument on the actionCreator.async for optimistic updates. This is very useful if you are
using redux-saga, see the example below. For base documentation see the original repo.

## Usage

### Async Action Creators

Async Action Creators are objects with properties `started`, `done`,`failed`, `optimistic` whose values are action
creators.

```ts
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

// specify parameters and result shapes as generic type arguments
const doSomething =
    actionCreator.async<{ foo: string },   // parameter type
        { bar: number },   // success type
        { code: number },  // error type
        { bar: number }    // optimistic type
        >('DO_SOMETHING');

console.log(doSomething.optimistic({
    params: {foo: 'lol'},
    result: {bar: 42},
}));
// {type: 'DO_SOMETHING_OPTIMISTIC', payload: {
//   params: {foo: 'lol'},
//   result: {bar: 42},
// }}

```

### Full Example

```ts
// Actions.ts
export const update = actionCreator.async<string, string[], { msg?: string, revertPayload: string[] }, string[]>(
    'UPDATE',
);

// Saga.ts
export function* updateSaga({
                                payload,
                            }: ReturnType<typeof Actions.update.started>) {

    const elements = yield select(Selectors.elements);
    try {
        const newElements = [...elements, payload];
        yield put(
            Actions.update.optimistic({
                params: payload,
                result: newElements,
            }),
        );
        const result = yield call(apiManager.mySvc().update, newElements);
        yield put(
            Actions.update.done({
                params: payload,
                result,
            }),
        );
    } catch (e: any) {
        yield put(
            Actions.update.failed({
                params: payload,
                result: {revertPayload: elements, msg: 'Error during update'},
            }),
        );
    }
};

// Reducer.ts
import {reducerWithInitialState} from 'typescript-fsa-reducers';

export const reducer = reducerWithInitialState(initialState)
    .cases([update.optimistic, update.done], (state, {result}) => {
        return {
            ...state,
            elements: result,
        };
    })
    .case(update.failed, (state, {result}) => {
        return {
            ...state,
            elements: result.revertPayload,
        };
    })
```