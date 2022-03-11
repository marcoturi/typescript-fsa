interface AnyAction {
    type: any;
}
declare type Meta = null | {
    [key: string]: any;
};
interface Action<Payload> extends AnyAction {
    type: string;
    payload: Payload;
    error?: boolean;
    meta?: Meta;
}
/**
 * Returns `true` if action has the same type as action creator.
 * Defines Type Guard that lets TypeScript know `payload` type inside blocks
 * where `isType` returned `true`.
 *
 * @example
 *
 *    const somethingHappened =
 *      actionCreator<{foo: string}>('SOMETHING_HAPPENED');
 *
 *    if (isType(action, somethingHappened)) {
 *      // action.payload has type {foo: string}
 *    }
 */
declare function isType<Payload>(action: AnyAction, actionCreator: ActionCreator<Payload>): action is Action<Payload>;
interface ActionCreator<Payload> {
    type: string;
    /**
     * Identical to `isType` except it is exposed as a bound method of an action
     * creator. Since it is bound and takes a single argument it is ideal for
     * passing to a filtering function like `Array.prototype.filter` or
     * RxJS's `Observable.prototype.filter`.
     *
     * @example
     *
     *    const somethingHappened =
     *      actionCreator<{foo: string}>('SOMETHING_HAPPENED');
     *    const somethingElseHappened =
     *      actionCreator<{bar: number}>('SOMETHING_ELSE_HAPPENED');
     *
     *    if (somethingHappened.match(action)) {
     *      // action.payload has type {foo: string}
     *    }
     *
     *    const actionArray = [
     *      somethingHappened({foo: 'foo'}),
     *      somethingElseHappened({bar: 5}),
     *    ];
     *
     *    // somethingHappenedArray has inferred type Action<{foo: string}>[]
     *    const somethingHappenedArray =
     *      actionArray.filter(somethingHappened.match);
     */
    match: (action: AnyAction) => action is Action<Payload>;
    /**
     * Creates action with given payload and metadata.
     *
     * @param payload Action payload.
     * @param meta Action metadata. Merged with `commonMeta` of Action Creator.
     */
    (payload: Payload, meta?: Meta): Action<Payload>;
}
declare type Success<Params, Result> = ({
    params: Params;
} | (Params extends void ? {
    params?: Params;
} : never)) & ({
    result: Result;
} | (Result extends void ? {
    result?: Result;
} : never));
declare type Optimistic<Params, Result> = ({
    params: Params;
} | (Params extends void ? {
    params?: Params;
} : never)) & ({
    result: Result;
} | (Result extends void ? {
    result?: Result;
} : never));
declare type Failure<Params, Error> = ({
    params: Params;
} | (Params extends void ? {
    params?: Params;
} : never)) & {
    error: Error;
};
interface AsyncActionCreators<Params, Result, Error = unknown, PreResult = unknown> {
    type: string;
    started: ActionCreator<Params>;
    done: ActionCreator<Success<Params, Result>>;
    optimistic: ActionCreator<Optimistic<Params, PreResult>>;
    failed: ActionCreator<Failure<Params, Error>>;
}
interface ActionCreatorFactory {
    /**
     * Creates Action Creator that produces actions with given `type` and payload
     * of type `Payload`.
     *
     * @param type Type of created actions.
     * @param commonMeta Metadata added to created actions.
     * @param isError Defines whether created actions are error actions.
     */ <Payload = void>(type: string, commonMeta?: Meta, isError?: boolean): ActionCreator<Payload>;
    /**
     * Creates Action Creator that produces actions with given `type` and payload
     * of type `Payload`.
     *
     * @param type Type of created actions.
     * @param commonMeta Metadata added to created actions.
     * @param isError Function that detects whether action is error given the
     *   payload.
     */ <Payload = void>(type: string, commonMeta?: Meta, isError?: (payload: Payload) => boolean): ActionCreator<Payload>;
    /**
     * Creates three Action Creators:
     * * `started: ActionCreator<Params>`
     * * `done: ActionCreator<{params: Params, result: Result}>`
     * * `failed: ActionCreator<{params: Params, error: Error}>`
     *
     * Useful to wrap asynchronous processes.
     *
     * @param type Prefix for types of created actions, which will have types
     *   `${type}_STARTED`, `${type}_DONE` and `${type}_FAILED`.
     * @param commonMeta Metadata added to created actions.
     */
    async<Params, Result, Error = unknown, PreResult = unknown>(type: string, commonMeta?: Meta): AsyncActionCreators<Params, Result, Error, PreResult>;
}
/**
 * Creates Action Creator factory with optional prefix for action types.
 * @param prefix Prefix to be prepended to action types as `<prefix>/<type>`.
 * @param defaultIsError Function that detects whether action is error given the
 *   payload. Default is `payload => payload instanceof Error`.
 */
declare function actionCreatorFactory(prefix?: string | null, defaultIsError?: (payload: any) => boolean): ActionCreatorFactory;

export { Action, ActionCreator, ActionCreatorFactory, AnyAction, AsyncActionCreators, Failure, Meta, Optimistic, Success, actionCreatorFactory, actionCreatorFactory as default, isType };
