
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model Driver
 * 
 */
export type Driver = $Result.DefaultSelection<Prisma.$DriverPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Vote
 * 
 */
export type Vote = $Result.DefaultSelection<Prisma.$VotePayload>
/**
 * Model SeasonVote
 * 
 */
export type SeasonVote = $Result.DefaultSelection<Prisma.$SeasonVotePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Teams
 * const teams = await prisma.team.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Teams
   * const teams = await prisma.team.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.driver`: Exposes CRUD operations for the **Driver** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Drivers
    * const drivers = await prisma.driver.findMany()
    * ```
    */
  get driver(): Prisma.DriverDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vote`: Exposes CRUD operations for the **Vote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Votes
    * const votes = await prisma.vote.findMany()
    * ```
    */
  get vote(): Prisma.VoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seasonVote`: Exposes CRUD operations for the **SeasonVote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeasonVotes
    * const seasonVotes = await prisma.seasonVote.findMany()
    * ```
    */
  get seasonVote(): Prisma.SeasonVoteDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.0
   * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Team: 'Team',
    Driver: 'Driver',
    User: 'User',
    Vote: 'Vote',
    SeasonVote: 'SeasonVote'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "team" | "driver" | "user" | "vote" | "seasonVote"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      Driver: {
        payload: Prisma.$DriverPayload<ExtArgs>
        fields: Prisma.DriverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DriverFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DriverFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          findFirst: {
            args: Prisma.DriverFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DriverFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          findMany: {
            args: Prisma.DriverFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>[]
          }
          create: {
            args: Prisma.DriverCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          createMany: {
            args: Prisma.DriverCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DriverCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>[]
          }
          delete: {
            args: Prisma.DriverDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          update: {
            args: Prisma.DriverUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          deleteMany: {
            args: Prisma.DriverDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DriverUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DriverUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>[]
          }
          upsert: {
            args: Prisma.DriverUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          aggregate: {
            args: Prisma.DriverAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDriver>
          }
          groupBy: {
            args: Prisma.DriverGroupByArgs<ExtArgs>
            result: $Utils.Optional<DriverGroupByOutputType>[]
          }
          count: {
            args: Prisma.DriverCountArgs<ExtArgs>
            result: $Utils.Optional<DriverCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Vote: {
        payload: Prisma.$VotePayload<ExtArgs>
        fields: Prisma.VoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          findFirst: {
            args: Prisma.VoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          findMany: {
            args: Prisma.VoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>[]
          }
          create: {
            args: Prisma.VoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          createMany: {
            args: Prisma.VoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>[]
          }
          delete: {
            args: Prisma.VoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          update: {
            args: Prisma.VoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          deleteMany: {
            args: Prisma.VoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>[]
          }
          upsert: {
            args: Prisma.VoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          aggregate: {
            args: Prisma.VoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVote>
          }
          groupBy: {
            args: Prisma.VoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<VoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.VoteCountArgs<ExtArgs>
            result: $Utils.Optional<VoteCountAggregateOutputType> | number
          }
        }
      }
      SeasonVote: {
        payload: Prisma.$SeasonVotePayload<ExtArgs>
        fields: Prisma.SeasonVoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeasonVoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeasonVoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>
          }
          findFirst: {
            args: Prisma.SeasonVoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeasonVoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>
          }
          findMany: {
            args: Prisma.SeasonVoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>[]
          }
          create: {
            args: Prisma.SeasonVoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>
          }
          createMany: {
            args: Prisma.SeasonVoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeasonVoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>[]
          }
          delete: {
            args: Prisma.SeasonVoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>
          }
          update: {
            args: Prisma.SeasonVoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>
          }
          deleteMany: {
            args: Prisma.SeasonVoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeasonVoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SeasonVoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>[]
          }
          upsert: {
            args: Prisma.SeasonVoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonVotePayload>
          }
          aggregate: {
            args: Prisma.SeasonVoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeasonVote>
          }
          groupBy: {
            args: Prisma.SeasonVoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeasonVoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeasonVoteCountArgs<ExtArgs>
            result: $Utils.Optional<SeasonVoteCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    team?: TeamOmit
    driver?: DriverOmit
    user?: UserOmit
    vote?: VoteOmit
    seasonVote?: SeasonVoteOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    users: number
    drivers: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TeamCountOutputTypeCountUsersArgs
    drivers?: boolean | TeamCountOutputTypeCountDriversArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountDriversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriverWhereInput
  }


  /**
   * Count Type DriverCountOutputType
   */

  export type DriverCountOutputType = {
    votes: number
    seasonVotes: number
    favorited: number
  }

  export type DriverCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    votes?: boolean | DriverCountOutputTypeCountVotesArgs
    seasonVotes?: boolean | DriverCountOutputTypeCountSeasonVotesArgs
    favorited?: boolean | DriverCountOutputTypeCountFavoritedArgs
  }

  // Custom InputTypes
  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverCountOutputType
     */
    select?: DriverCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VoteWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountSeasonVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeasonVoteWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountFavoritedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    votes: number
    seasonVotes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    votes?: boolean | UserCountOutputTypeCountVotesArgs
    seasonVotes?: boolean | UserCountOutputTypeCountSeasonVotesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VoteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSeasonVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeasonVoteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    name: number
    color: number
    _all: number
  }


  export type TeamMinAggregateInputType = {
    id?: true
    name?: true
    color?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    name?: true
    color?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    name?: true
    color?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    name: string
    color: string | null
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    users?: boolean | Team$usersArgs<ExtArgs>
    drivers?: boolean | Team$driversArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    name?: boolean
    color?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "color", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Team$usersArgs<ExtArgs>
    drivers?: boolean | Team$driversArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      drivers: Prisma.$DriverPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      color: string | null
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Team$usersArgs<ExtArgs> = {}>(args?: Subset<T, Team$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    drivers<T extends Team$driversArgs<ExtArgs> = {}>(args?: Subset<T, Team$driversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly name: FieldRef<"Team", 'String'>
    readonly color: FieldRef<"Team", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.users
   */
  export type Team$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Team.drivers
   */
  export type Team$driversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    where?: DriverWhereInput
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    cursor?: DriverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model Driver
   */

  export type AggregateDriver = {
    _count: DriverCountAggregateOutputType | null
    _avg: DriverAvgAggregateOutputType | null
    _sum: DriverSumAggregateOutputType | null
    _min: DriverMinAggregateOutputType | null
    _max: DriverMaxAggregateOutputType | null
  }

  export type DriverAvgAggregateOutputType = {
    number: number | null
  }

  export type DriverSumAggregateOutputType = {
    number: number | null
  }

  export type DriverMinAggregateOutputType = {
    slug: string | null
    name: string | null
    number: number | null
    country: string | null
    teamId: string | null
    color: string | null
  }

  export type DriverMaxAggregateOutputType = {
    slug: string | null
    name: string | null
    number: number | null
    country: string | null
    teamId: string | null
    color: string | null
  }

  export type DriverCountAggregateOutputType = {
    slug: number
    name: number
    number: number
    country: number
    teamId: number
    color: number
    _all: number
  }


  export type DriverAvgAggregateInputType = {
    number?: true
  }

  export type DriverSumAggregateInputType = {
    number?: true
  }

  export type DriverMinAggregateInputType = {
    slug?: true
    name?: true
    number?: true
    country?: true
    teamId?: true
    color?: true
  }

  export type DriverMaxAggregateInputType = {
    slug?: true
    name?: true
    number?: true
    country?: true
    teamId?: true
    color?: true
  }

  export type DriverCountAggregateInputType = {
    slug?: true
    name?: true
    number?: true
    country?: true
    teamId?: true
    color?: true
    _all?: true
  }

  export type DriverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Driver to aggregate.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Drivers
    **/
    _count?: true | DriverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DriverAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DriverSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DriverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DriverMaxAggregateInputType
  }

  export type GetDriverAggregateType<T extends DriverAggregateArgs> = {
        [P in keyof T & keyof AggregateDriver]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDriver[P]>
      : GetScalarType<T[P], AggregateDriver[P]>
  }




  export type DriverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriverWhereInput
    orderBy?: DriverOrderByWithAggregationInput | DriverOrderByWithAggregationInput[]
    by: DriverScalarFieldEnum[] | DriverScalarFieldEnum
    having?: DriverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DriverCountAggregateInputType | true
    _avg?: DriverAvgAggregateInputType
    _sum?: DriverSumAggregateInputType
    _min?: DriverMinAggregateInputType
    _max?: DriverMaxAggregateInputType
  }

  export type DriverGroupByOutputType = {
    slug: string
    name: string
    number: number
    country: string | null
    teamId: string
    color: string | null
    _count: DriverCountAggregateOutputType | null
    _avg: DriverAvgAggregateOutputType | null
    _sum: DriverSumAggregateOutputType | null
    _min: DriverMinAggregateOutputType | null
    _max: DriverMaxAggregateOutputType | null
  }

  type GetDriverGroupByPayload<T extends DriverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DriverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DriverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DriverGroupByOutputType[P]>
            : GetScalarType<T[P], DriverGroupByOutputType[P]>
        }
      >
    >


  export type DriverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    name?: boolean
    number?: boolean
    country?: boolean
    teamId?: boolean
    color?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    votes?: boolean | Driver$votesArgs<ExtArgs>
    seasonVotes?: boolean | Driver$seasonVotesArgs<ExtArgs>
    favorited?: boolean | Driver$favoritedArgs<ExtArgs>
    _count?: boolean | DriverCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driver"]>

  export type DriverSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    name?: boolean
    number?: boolean
    country?: boolean
    teamId?: boolean
    color?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driver"]>

  export type DriverSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    slug?: boolean
    name?: boolean
    number?: boolean
    country?: boolean
    teamId?: boolean
    color?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driver"]>

  export type DriverSelectScalar = {
    slug?: boolean
    name?: boolean
    number?: boolean
    country?: boolean
    teamId?: boolean
    color?: boolean
  }

  export type DriverOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"slug" | "name" | "number" | "country" | "teamId" | "color", ExtArgs["result"]["driver"]>
  export type DriverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    votes?: boolean | Driver$votesArgs<ExtArgs>
    seasonVotes?: boolean | Driver$seasonVotesArgs<ExtArgs>
    favorited?: boolean | Driver$favoritedArgs<ExtArgs>
    _count?: boolean | DriverCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DriverIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type DriverIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $DriverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Driver"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
      votes: Prisma.$VotePayload<ExtArgs>[]
      seasonVotes: Prisma.$SeasonVotePayload<ExtArgs>[]
      favorited: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      slug: string
      name: string
      number: number
      country: string | null
      teamId: string
      color: string | null
    }, ExtArgs["result"]["driver"]>
    composites: {}
  }

  type DriverGetPayload<S extends boolean | null | undefined | DriverDefaultArgs> = $Result.GetResult<Prisma.$DriverPayload, S>

  type DriverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DriverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DriverCountAggregateInputType | true
    }

  export interface DriverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Driver'], meta: { name: 'Driver' } }
    /**
     * Find zero or one Driver that matches the filter.
     * @param {DriverFindUniqueArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DriverFindUniqueArgs>(args: SelectSubset<T, DriverFindUniqueArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Driver that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DriverFindUniqueOrThrowArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DriverFindUniqueOrThrowArgs>(args: SelectSubset<T, DriverFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Driver that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverFindFirstArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DriverFindFirstArgs>(args?: SelectSubset<T, DriverFindFirstArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Driver that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverFindFirstOrThrowArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DriverFindFirstOrThrowArgs>(args?: SelectSubset<T, DriverFindFirstOrThrowArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Drivers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Drivers
     * const drivers = await prisma.driver.findMany()
     * 
     * // Get first 10 Drivers
     * const drivers = await prisma.driver.findMany({ take: 10 })
     * 
     * // Only select the `slug`
     * const driverWithSlugOnly = await prisma.driver.findMany({ select: { slug: true } })
     * 
     */
    findMany<T extends DriverFindManyArgs>(args?: SelectSubset<T, DriverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Driver.
     * @param {DriverCreateArgs} args - Arguments to create a Driver.
     * @example
     * // Create one Driver
     * const Driver = await prisma.driver.create({
     *   data: {
     *     // ... data to create a Driver
     *   }
     * })
     * 
     */
    create<T extends DriverCreateArgs>(args: SelectSubset<T, DriverCreateArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Drivers.
     * @param {DriverCreateManyArgs} args - Arguments to create many Drivers.
     * @example
     * // Create many Drivers
     * const driver = await prisma.driver.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DriverCreateManyArgs>(args?: SelectSubset<T, DriverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Drivers and returns the data saved in the database.
     * @param {DriverCreateManyAndReturnArgs} args - Arguments to create many Drivers.
     * @example
     * // Create many Drivers
     * const driver = await prisma.driver.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Drivers and only return the `slug`
     * const driverWithSlugOnly = await prisma.driver.createManyAndReturn({
     *   select: { slug: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DriverCreateManyAndReturnArgs>(args?: SelectSubset<T, DriverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Driver.
     * @param {DriverDeleteArgs} args - Arguments to delete one Driver.
     * @example
     * // Delete one Driver
     * const Driver = await prisma.driver.delete({
     *   where: {
     *     // ... filter to delete one Driver
     *   }
     * })
     * 
     */
    delete<T extends DriverDeleteArgs>(args: SelectSubset<T, DriverDeleteArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Driver.
     * @param {DriverUpdateArgs} args - Arguments to update one Driver.
     * @example
     * // Update one Driver
     * const driver = await prisma.driver.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DriverUpdateArgs>(args: SelectSubset<T, DriverUpdateArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Drivers.
     * @param {DriverDeleteManyArgs} args - Arguments to filter Drivers to delete.
     * @example
     * // Delete a few Drivers
     * const { count } = await prisma.driver.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DriverDeleteManyArgs>(args?: SelectSubset<T, DriverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Drivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Drivers
     * const driver = await prisma.driver.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DriverUpdateManyArgs>(args: SelectSubset<T, DriverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Drivers and returns the data updated in the database.
     * @param {DriverUpdateManyAndReturnArgs} args - Arguments to update many Drivers.
     * @example
     * // Update many Drivers
     * const driver = await prisma.driver.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Drivers and only return the `slug`
     * const driverWithSlugOnly = await prisma.driver.updateManyAndReturn({
     *   select: { slug: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DriverUpdateManyAndReturnArgs>(args: SelectSubset<T, DriverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Driver.
     * @param {DriverUpsertArgs} args - Arguments to update or create a Driver.
     * @example
     * // Update or create a Driver
     * const driver = await prisma.driver.upsert({
     *   create: {
     *     // ... data to create a Driver
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Driver we want to update
     *   }
     * })
     */
    upsert<T extends DriverUpsertArgs>(args: SelectSubset<T, DriverUpsertArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Drivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverCountArgs} args - Arguments to filter Drivers to count.
     * @example
     * // Count the number of Drivers
     * const count = await prisma.driver.count({
     *   where: {
     *     // ... the filter for the Drivers we want to count
     *   }
     * })
    **/
    count<T extends DriverCountArgs>(
      args?: Subset<T, DriverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DriverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Driver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DriverAggregateArgs>(args: Subset<T, DriverAggregateArgs>): Prisma.PrismaPromise<GetDriverAggregateType<T>>

    /**
     * Group by Driver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DriverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DriverGroupByArgs['orderBy'] }
        : { orderBy?: DriverGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DriverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Driver model
   */
  readonly fields: DriverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Driver.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DriverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    votes<T extends Driver$votesArgs<ExtArgs> = {}>(args?: Subset<T, Driver$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    seasonVotes<T extends Driver$seasonVotesArgs<ExtArgs> = {}>(args?: Subset<T, Driver$seasonVotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    favorited<T extends Driver$favoritedArgs<ExtArgs> = {}>(args?: Subset<T, Driver$favoritedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Driver model
   */
  interface DriverFieldRefs {
    readonly slug: FieldRef<"Driver", 'String'>
    readonly name: FieldRef<"Driver", 'String'>
    readonly number: FieldRef<"Driver", 'Int'>
    readonly country: FieldRef<"Driver", 'String'>
    readonly teamId: FieldRef<"Driver", 'String'>
    readonly color: FieldRef<"Driver", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Driver findUnique
   */
  export type DriverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver findUniqueOrThrow
   */
  export type DriverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver findFirst
   */
  export type DriverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Drivers.
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drivers.
     */
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Driver findFirstOrThrow
   */
  export type DriverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Drivers.
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drivers.
     */
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Driver findMany
   */
  export type DriverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Drivers to fetch.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Drivers.
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Driver create
   */
  export type DriverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * The data needed to create a Driver.
     */
    data: XOR<DriverCreateInput, DriverUncheckedCreateInput>
  }

  /**
   * Driver createMany
   */
  export type DriverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Drivers.
     */
    data: DriverCreateManyInput | DriverCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Driver createManyAndReturn
   */
  export type DriverCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * The data used to create many Drivers.
     */
    data: DriverCreateManyInput | DriverCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Driver update
   */
  export type DriverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * The data needed to update a Driver.
     */
    data: XOR<DriverUpdateInput, DriverUncheckedUpdateInput>
    /**
     * Choose, which Driver to update.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver updateMany
   */
  export type DriverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Drivers.
     */
    data: XOR<DriverUpdateManyMutationInput, DriverUncheckedUpdateManyInput>
    /**
     * Filter which Drivers to update
     */
    where?: DriverWhereInput
    /**
     * Limit how many Drivers to update.
     */
    limit?: number
  }

  /**
   * Driver updateManyAndReturn
   */
  export type DriverUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * The data used to update Drivers.
     */
    data: XOR<DriverUpdateManyMutationInput, DriverUncheckedUpdateManyInput>
    /**
     * Filter which Drivers to update
     */
    where?: DriverWhereInput
    /**
     * Limit how many Drivers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Driver upsert
   */
  export type DriverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * The filter to search for the Driver to update in case it exists.
     */
    where: DriverWhereUniqueInput
    /**
     * In case the Driver found by the `where` argument doesn't exist, create a new Driver with this data.
     */
    create: XOR<DriverCreateInput, DriverUncheckedCreateInput>
    /**
     * In case the Driver was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DriverUpdateInput, DriverUncheckedUpdateInput>
  }

  /**
   * Driver delete
   */
  export type DriverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter which Driver to delete.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver deleteMany
   */
  export type DriverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Drivers to delete
     */
    where?: DriverWhereInput
    /**
     * Limit how many Drivers to delete.
     */
    limit?: number
  }

  /**
   * Driver.votes
   */
  export type Driver$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    where?: VoteWhereInput
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    cursor?: VoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Driver.seasonVotes
   */
  export type Driver$seasonVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    where?: SeasonVoteWhereInput
    orderBy?: SeasonVoteOrderByWithRelationInput | SeasonVoteOrderByWithRelationInput[]
    cursor?: SeasonVoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeasonVoteScalarFieldEnum | SeasonVoteScalarFieldEnum[]
  }

  /**
   * Driver.favorited
   */
  export type Driver$favoritedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Driver without action
   */
  export type DriverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    name: string | null
    isAdmin: boolean | null
    teamId: string | null
    favoriteDriverId: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    name: string | null
    isAdmin: boolean | null
    teamId: string | null
    favoriteDriverId: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    name: number
    isAdmin: number
    teamId: number
    favoriteDriverId: number
    avatar: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    name?: true
    isAdmin?: true
    teamId?: true
    favoriteDriverId?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    name?: true
    isAdmin?: true
    teamId?: true
    favoriteDriverId?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    name?: true
    isAdmin?: true
    teamId?: true
    favoriteDriverId?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password: string
    name: string | null
    isAdmin: boolean
    teamId: string | null
    favoriteDriverId: string | null
    avatar: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    isAdmin?: boolean
    teamId?: boolean
    favoriteDriverId?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    team?: boolean | User$teamArgs<ExtArgs>
    favoriteDriver?: boolean | User$favoriteDriverArgs<ExtArgs>
    votes?: boolean | User$votesArgs<ExtArgs>
    seasonVotes?: boolean | User$seasonVotesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    isAdmin?: boolean
    teamId?: boolean
    favoriteDriverId?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    team?: boolean | User$teamArgs<ExtArgs>
    favoriteDriver?: boolean | User$favoriteDriverArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    isAdmin?: boolean
    teamId?: boolean
    favoriteDriverId?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    team?: boolean | User$teamArgs<ExtArgs>
    favoriteDriver?: boolean | User$favoriteDriverArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    isAdmin?: boolean
    teamId?: boolean
    favoriteDriverId?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "name" | "isAdmin" | "teamId" | "favoriteDriverId" | "avatar" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | User$teamArgs<ExtArgs>
    favoriteDriver?: boolean | User$favoriteDriverArgs<ExtArgs>
    votes?: boolean | User$votesArgs<ExtArgs>
    seasonVotes?: boolean | User$seasonVotesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | User$teamArgs<ExtArgs>
    favoriteDriver?: boolean | User$favoriteDriverArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | User$teamArgs<ExtArgs>
    favoriteDriver?: boolean | User$favoriteDriverArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs> | null
      favoriteDriver: Prisma.$DriverPayload<ExtArgs> | null
      votes: Prisma.$VotePayload<ExtArgs>[]
      seasonVotes: Prisma.$SeasonVotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password: string
      name: string | null
      isAdmin: boolean
      teamId: string | null
      favoriteDriverId: string | null
      avatar: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends User$teamArgs<ExtArgs> = {}>(args?: Subset<T, User$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    favoriteDriver<T extends User$favoriteDriverArgs<ExtArgs> = {}>(args?: Subset<T, User$favoriteDriverArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    votes<T extends User$votesArgs<ExtArgs> = {}>(args?: Subset<T, User$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    seasonVotes<T extends User$seasonVotesArgs<ExtArgs> = {}>(args?: Subset<T, User$seasonVotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly isAdmin: FieldRef<"User", 'Boolean'>
    readonly teamId: FieldRef<"User", 'String'>
    readonly favoriteDriverId: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.team
   */
  export type User$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * User.favoriteDriver
   */
  export type User$favoriteDriverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    where?: DriverWhereInput
  }

  /**
   * User.votes
   */
  export type User$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    where?: VoteWhereInput
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    cursor?: VoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * User.seasonVotes
   */
  export type User$seasonVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    where?: SeasonVoteWhereInput
    orderBy?: SeasonVoteOrderByWithRelationInput | SeasonVoteOrderByWithRelationInput[]
    cursor?: SeasonVoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeasonVoteScalarFieldEnum | SeasonVoteScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Vote
   */

  export type AggregateVote = {
    _count: VoteCountAggregateOutputType | null
    _min: VoteMinAggregateOutputType | null
    _max: VoteMaxAggregateOutputType | null
  }

  export type VoteMinAggregateOutputType = {
    id: string | null
    userId: string | null
    driverId: string | null
    raceRound: string | null
    createdAt: Date | null
  }

  export type VoteMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    driverId: string | null
    raceRound: string | null
    createdAt: Date | null
  }

  export type VoteCountAggregateOutputType = {
    id: number
    userId: number
    driverId: number
    raceRound: number
    createdAt: number
    _all: number
  }


  export type VoteMinAggregateInputType = {
    id?: true
    userId?: true
    driverId?: true
    raceRound?: true
    createdAt?: true
  }

  export type VoteMaxAggregateInputType = {
    id?: true
    userId?: true
    driverId?: true
    raceRound?: true
    createdAt?: true
  }

  export type VoteCountAggregateInputType = {
    id?: true
    userId?: true
    driverId?: true
    raceRound?: true
    createdAt?: true
    _all?: true
  }

  export type VoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vote to aggregate.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Votes
    **/
    _count?: true | VoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VoteMaxAggregateInputType
  }

  export type GetVoteAggregateType<T extends VoteAggregateArgs> = {
        [P in keyof T & keyof AggregateVote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVote[P]>
      : GetScalarType<T[P], AggregateVote[P]>
  }




  export type VoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VoteWhereInput
    orderBy?: VoteOrderByWithAggregationInput | VoteOrderByWithAggregationInput[]
    by: VoteScalarFieldEnum[] | VoteScalarFieldEnum
    having?: VoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VoteCountAggregateInputType | true
    _min?: VoteMinAggregateInputType
    _max?: VoteMaxAggregateInputType
  }

  export type VoteGroupByOutputType = {
    id: string
    userId: string
    driverId: string
    raceRound: string
    createdAt: Date
    _count: VoteCountAggregateOutputType | null
    _min: VoteMinAggregateOutputType | null
    _max: VoteMaxAggregateOutputType | null
  }

  type GetVoteGroupByPayload<T extends VoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VoteGroupByOutputType[P]>
            : GetScalarType<T[P], VoteGroupByOutputType[P]>
        }
      >
    >


  export type VoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    driverId?: boolean
    raceRound?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vote"]>

  export type VoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    driverId?: boolean
    raceRound?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vote"]>

  export type VoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    driverId?: boolean
    raceRound?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vote"]>

  export type VoteSelectScalar = {
    id?: boolean
    userId?: boolean
    driverId?: boolean
    raceRound?: boolean
    createdAt?: boolean
  }

  export type VoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "driverId" | "raceRound" | "createdAt", ExtArgs["result"]["vote"]>
  export type VoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type VoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type VoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }

  export type $VotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vote"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      driver: Prisma.$DriverPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      driverId: string
      raceRound: string
      createdAt: Date
    }, ExtArgs["result"]["vote"]>
    composites: {}
  }

  type VoteGetPayload<S extends boolean | null | undefined | VoteDefaultArgs> = $Result.GetResult<Prisma.$VotePayload, S>

  type VoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VoteCountAggregateInputType | true
    }

  export interface VoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vote'], meta: { name: 'Vote' } }
    /**
     * Find zero or one Vote that matches the filter.
     * @param {VoteFindUniqueArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VoteFindUniqueArgs>(args: SelectSubset<T, VoteFindUniqueArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VoteFindUniqueOrThrowArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VoteFindUniqueOrThrowArgs>(args: SelectSubset<T, VoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteFindFirstArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VoteFindFirstArgs>(args?: SelectSubset<T, VoteFindFirstArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteFindFirstOrThrowArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VoteFindFirstOrThrowArgs>(args?: SelectSubset<T, VoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Votes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Votes
     * const votes = await prisma.vote.findMany()
     * 
     * // Get first 10 Votes
     * const votes = await prisma.vote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const voteWithIdOnly = await prisma.vote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VoteFindManyArgs>(args?: SelectSubset<T, VoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vote.
     * @param {VoteCreateArgs} args - Arguments to create a Vote.
     * @example
     * // Create one Vote
     * const Vote = await prisma.vote.create({
     *   data: {
     *     // ... data to create a Vote
     *   }
     * })
     * 
     */
    create<T extends VoteCreateArgs>(args: SelectSubset<T, VoteCreateArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Votes.
     * @param {VoteCreateManyArgs} args - Arguments to create many Votes.
     * @example
     * // Create many Votes
     * const vote = await prisma.vote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VoteCreateManyArgs>(args?: SelectSubset<T, VoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Votes and returns the data saved in the database.
     * @param {VoteCreateManyAndReturnArgs} args - Arguments to create many Votes.
     * @example
     * // Create many Votes
     * const vote = await prisma.vote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Votes and only return the `id`
     * const voteWithIdOnly = await prisma.vote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VoteCreateManyAndReturnArgs>(args?: SelectSubset<T, VoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vote.
     * @param {VoteDeleteArgs} args - Arguments to delete one Vote.
     * @example
     * // Delete one Vote
     * const Vote = await prisma.vote.delete({
     *   where: {
     *     // ... filter to delete one Vote
     *   }
     * })
     * 
     */
    delete<T extends VoteDeleteArgs>(args: SelectSubset<T, VoteDeleteArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vote.
     * @param {VoteUpdateArgs} args - Arguments to update one Vote.
     * @example
     * // Update one Vote
     * const vote = await prisma.vote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VoteUpdateArgs>(args: SelectSubset<T, VoteUpdateArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Votes.
     * @param {VoteDeleteManyArgs} args - Arguments to filter Votes to delete.
     * @example
     * // Delete a few Votes
     * const { count } = await prisma.vote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VoteDeleteManyArgs>(args?: SelectSubset<T, VoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Votes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Votes
     * const vote = await prisma.vote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VoteUpdateManyArgs>(args: SelectSubset<T, VoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Votes and returns the data updated in the database.
     * @param {VoteUpdateManyAndReturnArgs} args - Arguments to update many Votes.
     * @example
     * // Update many Votes
     * const vote = await prisma.vote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Votes and only return the `id`
     * const voteWithIdOnly = await prisma.vote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VoteUpdateManyAndReturnArgs>(args: SelectSubset<T, VoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vote.
     * @param {VoteUpsertArgs} args - Arguments to update or create a Vote.
     * @example
     * // Update or create a Vote
     * const vote = await prisma.vote.upsert({
     *   create: {
     *     // ... data to create a Vote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vote we want to update
     *   }
     * })
     */
    upsert<T extends VoteUpsertArgs>(args: SelectSubset<T, VoteUpsertArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Votes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteCountArgs} args - Arguments to filter Votes to count.
     * @example
     * // Count the number of Votes
     * const count = await prisma.vote.count({
     *   where: {
     *     // ... the filter for the Votes we want to count
     *   }
     * })
    **/
    count<T extends VoteCountArgs>(
      args?: Subset<T, VoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VoteAggregateArgs>(args: Subset<T, VoteAggregateArgs>): Prisma.PrismaPromise<GetVoteAggregateType<T>>

    /**
     * Group by Vote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VoteGroupByArgs['orderBy'] }
        : { orderBy?: VoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vote model
   */
  readonly fields: VoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    driver<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vote model
   */
  interface VoteFieldRefs {
    readonly id: FieldRef<"Vote", 'String'>
    readonly userId: FieldRef<"Vote", 'String'>
    readonly driverId: FieldRef<"Vote", 'String'>
    readonly raceRound: FieldRef<"Vote", 'String'>
    readonly createdAt: FieldRef<"Vote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vote findUnique
   */
  export type VoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote findUniqueOrThrow
   */
  export type VoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote findFirst
   */
  export type VoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Votes.
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Votes.
     */
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Vote findFirstOrThrow
   */
  export type VoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Votes.
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Votes.
     */
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Vote findMany
   */
  export type VoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Votes to fetch.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Votes.
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Vote create
   */
  export type VoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Vote.
     */
    data: XOR<VoteCreateInput, VoteUncheckedCreateInput>
  }

  /**
   * Vote createMany
   */
  export type VoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Votes.
     */
    data: VoteCreateManyInput | VoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vote createManyAndReturn
   */
  export type VoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * The data used to create many Votes.
     */
    data: VoteCreateManyInput | VoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vote update
   */
  export type VoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Vote.
     */
    data: XOR<VoteUpdateInput, VoteUncheckedUpdateInput>
    /**
     * Choose, which Vote to update.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote updateMany
   */
  export type VoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Votes.
     */
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyInput>
    /**
     * Filter which Votes to update
     */
    where?: VoteWhereInput
    /**
     * Limit how many Votes to update.
     */
    limit?: number
  }

  /**
   * Vote updateManyAndReturn
   */
  export type VoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * The data used to update Votes.
     */
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyInput>
    /**
     * Filter which Votes to update
     */
    where?: VoteWhereInput
    /**
     * Limit how many Votes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vote upsert
   */
  export type VoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Vote to update in case it exists.
     */
    where: VoteWhereUniqueInput
    /**
     * In case the Vote found by the `where` argument doesn't exist, create a new Vote with this data.
     */
    create: XOR<VoteCreateInput, VoteUncheckedCreateInput>
    /**
     * In case the Vote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VoteUpdateInput, VoteUncheckedUpdateInput>
  }

  /**
   * Vote delete
   */
  export type VoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter which Vote to delete.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote deleteMany
   */
  export type VoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Votes to delete
     */
    where?: VoteWhereInput
    /**
     * Limit how many Votes to delete.
     */
    limit?: number
  }

  /**
   * Vote without action
   */
  export type VoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
  }


  /**
   * Model SeasonVote
   */

  export type AggregateSeasonVote = {
    _count: SeasonVoteCountAggregateOutputType | null
    _avg: SeasonVoteAvgAggregateOutputType | null
    _sum: SeasonVoteSumAggregateOutputType | null
    _min: SeasonVoteMinAggregateOutputType | null
    _max: SeasonVoteMaxAggregateOutputType | null
  }

  export type SeasonVoteAvgAggregateOutputType = {
    position: number | null
    season: number | null
  }

  export type SeasonVoteSumAggregateOutputType = {
    position: number | null
    season: number | null
  }

  export type SeasonVoteMinAggregateOutputType = {
    id: string | null
    userId: string | null
    driverId: string | null
    position: number | null
    season: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeasonVoteMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    driverId: string | null
    position: number | null
    season: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeasonVoteCountAggregateOutputType = {
    id: number
    userId: number
    driverId: number
    position: number
    season: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SeasonVoteAvgAggregateInputType = {
    position?: true
    season?: true
  }

  export type SeasonVoteSumAggregateInputType = {
    position?: true
    season?: true
  }

  export type SeasonVoteMinAggregateInputType = {
    id?: true
    userId?: true
    driverId?: true
    position?: true
    season?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeasonVoteMaxAggregateInputType = {
    id?: true
    userId?: true
    driverId?: true
    position?: true
    season?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeasonVoteCountAggregateInputType = {
    id?: true
    userId?: true
    driverId?: true
    position?: true
    season?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SeasonVoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonVote to aggregate.
     */
    where?: SeasonVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonVotes to fetch.
     */
    orderBy?: SeasonVoteOrderByWithRelationInput | SeasonVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeasonVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeasonVotes
    **/
    _count?: true | SeasonVoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeasonVoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeasonVoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeasonVoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeasonVoteMaxAggregateInputType
  }

  export type GetSeasonVoteAggregateType<T extends SeasonVoteAggregateArgs> = {
        [P in keyof T & keyof AggregateSeasonVote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeasonVote[P]>
      : GetScalarType<T[P], AggregateSeasonVote[P]>
  }




  export type SeasonVoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeasonVoteWhereInput
    orderBy?: SeasonVoteOrderByWithAggregationInput | SeasonVoteOrderByWithAggregationInput[]
    by: SeasonVoteScalarFieldEnum[] | SeasonVoteScalarFieldEnum
    having?: SeasonVoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeasonVoteCountAggregateInputType | true
    _avg?: SeasonVoteAvgAggregateInputType
    _sum?: SeasonVoteSumAggregateInputType
    _min?: SeasonVoteMinAggregateInputType
    _max?: SeasonVoteMaxAggregateInputType
  }

  export type SeasonVoteGroupByOutputType = {
    id: string
    userId: string
    driverId: string
    position: number
    season: number
    createdAt: Date
    updatedAt: Date
    _count: SeasonVoteCountAggregateOutputType | null
    _avg: SeasonVoteAvgAggregateOutputType | null
    _sum: SeasonVoteSumAggregateOutputType | null
    _min: SeasonVoteMinAggregateOutputType | null
    _max: SeasonVoteMaxAggregateOutputType | null
  }

  type GetSeasonVoteGroupByPayload<T extends SeasonVoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeasonVoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeasonVoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeasonVoteGroupByOutputType[P]>
            : GetScalarType<T[P], SeasonVoteGroupByOutputType[P]>
        }
      >
    >


  export type SeasonVoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    driverId?: boolean
    position?: boolean
    season?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seasonVote"]>

  export type SeasonVoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    driverId?: boolean
    position?: boolean
    season?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seasonVote"]>

  export type SeasonVoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    driverId?: boolean
    position?: boolean
    season?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seasonVote"]>

  export type SeasonVoteSelectScalar = {
    id?: boolean
    userId?: boolean
    driverId?: boolean
    position?: boolean
    season?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SeasonVoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "driverId" | "position" | "season" | "createdAt" | "updatedAt", ExtArgs["result"]["seasonVote"]>
  export type SeasonVoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type SeasonVoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type SeasonVoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }

  export type $SeasonVotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeasonVote"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      driver: Prisma.$DriverPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      driverId: string
      position: number
      season: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["seasonVote"]>
    composites: {}
  }

  type SeasonVoteGetPayload<S extends boolean | null | undefined | SeasonVoteDefaultArgs> = $Result.GetResult<Prisma.$SeasonVotePayload, S>

  type SeasonVoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeasonVoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeasonVoteCountAggregateInputType | true
    }

  export interface SeasonVoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeasonVote'], meta: { name: 'SeasonVote' } }
    /**
     * Find zero or one SeasonVote that matches the filter.
     * @param {SeasonVoteFindUniqueArgs} args - Arguments to find a SeasonVote
     * @example
     * // Get one SeasonVote
     * const seasonVote = await prisma.seasonVote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonVoteFindUniqueArgs>(args: SelectSubset<T, SeasonVoteFindUniqueArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SeasonVote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeasonVoteFindUniqueOrThrowArgs} args - Arguments to find a SeasonVote
     * @example
     * // Get one SeasonVote
     * const seasonVote = await prisma.seasonVote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonVoteFindUniqueOrThrowArgs>(args: SelectSubset<T, SeasonVoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeasonVote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteFindFirstArgs} args - Arguments to find a SeasonVote
     * @example
     * // Get one SeasonVote
     * const seasonVote = await prisma.seasonVote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonVoteFindFirstArgs>(args?: SelectSubset<T, SeasonVoteFindFirstArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeasonVote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteFindFirstOrThrowArgs} args - Arguments to find a SeasonVote
     * @example
     * // Get one SeasonVote
     * const seasonVote = await prisma.seasonVote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonVoteFindFirstOrThrowArgs>(args?: SelectSubset<T, SeasonVoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SeasonVotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeasonVotes
     * const seasonVotes = await prisma.seasonVote.findMany()
     * 
     * // Get first 10 SeasonVotes
     * const seasonVotes = await prisma.seasonVote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seasonVoteWithIdOnly = await prisma.seasonVote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeasonVoteFindManyArgs>(args?: SelectSubset<T, SeasonVoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SeasonVote.
     * @param {SeasonVoteCreateArgs} args - Arguments to create a SeasonVote.
     * @example
     * // Create one SeasonVote
     * const SeasonVote = await prisma.seasonVote.create({
     *   data: {
     *     // ... data to create a SeasonVote
     *   }
     * })
     * 
     */
    create<T extends SeasonVoteCreateArgs>(args: SelectSubset<T, SeasonVoteCreateArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SeasonVotes.
     * @param {SeasonVoteCreateManyArgs} args - Arguments to create many SeasonVotes.
     * @example
     * // Create many SeasonVotes
     * const seasonVote = await prisma.seasonVote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeasonVoteCreateManyArgs>(args?: SelectSubset<T, SeasonVoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SeasonVotes and returns the data saved in the database.
     * @param {SeasonVoteCreateManyAndReturnArgs} args - Arguments to create many SeasonVotes.
     * @example
     * // Create many SeasonVotes
     * const seasonVote = await prisma.seasonVote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SeasonVotes and only return the `id`
     * const seasonVoteWithIdOnly = await prisma.seasonVote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeasonVoteCreateManyAndReturnArgs>(args?: SelectSubset<T, SeasonVoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SeasonVote.
     * @param {SeasonVoteDeleteArgs} args - Arguments to delete one SeasonVote.
     * @example
     * // Delete one SeasonVote
     * const SeasonVote = await prisma.seasonVote.delete({
     *   where: {
     *     // ... filter to delete one SeasonVote
     *   }
     * })
     * 
     */
    delete<T extends SeasonVoteDeleteArgs>(args: SelectSubset<T, SeasonVoteDeleteArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SeasonVote.
     * @param {SeasonVoteUpdateArgs} args - Arguments to update one SeasonVote.
     * @example
     * // Update one SeasonVote
     * const seasonVote = await prisma.seasonVote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeasonVoteUpdateArgs>(args: SelectSubset<T, SeasonVoteUpdateArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SeasonVotes.
     * @param {SeasonVoteDeleteManyArgs} args - Arguments to filter SeasonVotes to delete.
     * @example
     * // Delete a few SeasonVotes
     * const { count } = await prisma.seasonVote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeasonVoteDeleteManyArgs>(args?: SelectSubset<T, SeasonVoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeasonVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeasonVotes
     * const seasonVote = await prisma.seasonVote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeasonVoteUpdateManyArgs>(args: SelectSubset<T, SeasonVoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeasonVotes and returns the data updated in the database.
     * @param {SeasonVoteUpdateManyAndReturnArgs} args - Arguments to update many SeasonVotes.
     * @example
     * // Update many SeasonVotes
     * const seasonVote = await prisma.seasonVote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SeasonVotes and only return the `id`
     * const seasonVoteWithIdOnly = await prisma.seasonVote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SeasonVoteUpdateManyAndReturnArgs>(args: SelectSubset<T, SeasonVoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SeasonVote.
     * @param {SeasonVoteUpsertArgs} args - Arguments to update or create a SeasonVote.
     * @example
     * // Update or create a SeasonVote
     * const seasonVote = await prisma.seasonVote.upsert({
     *   create: {
     *     // ... data to create a SeasonVote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeasonVote we want to update
     *   }
     * })
     */
    upsert<T extends SeasonVoteUpsertArgs>(args: SelectSubset<T, SeasonVoteUpsertArgs<ExtArgs>>): Prisma__SeasonVoteClient<$Result.GetResult<Prisma.$SeasonVotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SeasonVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteCountArgs} args - Arguments to filter SeasonVotes to count.
     * @example
     * // Count the number of SeasonVotes
     * const count = await prisma.seasonVote.count({
     *   where: {
     *     // ... the filter for the SeasonVotes we want to count
     *   }
     * })
    **/
    count<T extends SeasonVoteCountArgs>(
      args?: Subset<T, SeasonVoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeasonVoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeasonVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeasonVoteAggregateArgs>(args: Subset<T, SeasonVoteAggregateArgs>): Prisma.PrismaPromise<GetSeasonVoteAggregateType<T>>

    /**
     * Group by SeasonVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonVoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeasonVoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeasonVoteGroupByArgs['orderBy'] }
        : { orderBy?: SeasonVoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeasonVoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeasonVote model
   */
  readonly fields: SeasonVoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeasonVote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeasonVoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    driver<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeasonVote model
   */
  interface SeasonVoteFieldRefs {
    readonly id: FieldRef<"SeasonVote", 'String'>
    readonly userId: FieldRef<"SeasonVote", 'String'>
    readonly driverId: FieldRef<"SeasonVote", 'String'>
    readonly position: FieldRef<"SeasonVote", 'Int'>
    readonly season: FieldRef<"SeasonVote", 'Int'>
    readonly createdAt: FieldRef<"SeasonVote", 'DateTime'>
    readonly updatedAt: FieldRef<"SeasonVote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeasonVote findUnique
   */
  export type SeasonVoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * Filter, which SeasonVote to fetch.
     */
    where: SeasonVoteWhereUniqueInput
  }

  /**
   * SeasonVote findUniqueOrThrow
   */
  export type SeasonVoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * Filter, which SeasonVote to fetch.
     */
    where: SeasonVoteWhereUniqueInput
  }

  /**
   * SeasonVote findFirst
   */
  export type SeasonVoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * Filter, which SeasonVote to fetch.
     */
    where?: SeasonVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonVotes to fetch.
     */
    orderBy?: SeasonVoteOrderByWithRelationInput | SeasonVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeasonVotes.
     */
    cursor?: SeasonVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeasonVotes.
     */
    distinct?: SeasonVoteScalarFieldEnum | SeasonVoteScalarFieldEnum[]
  }

  /**
   * SeasonVote findFirstOrThrow
   */
  export type SeasonVoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * Filter, which SeasonVote to fetch.
     */
    where?: SeasonVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonVotes to fetch.
     */
    orderBy?: SeasonVoteOrderByWithRelationInput | SeasonVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeasonVotes.
     */
    cursor?: SeasonVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeasonVotes.
     */
    distinct?: SeasonVoteScalarFieldEnum | SeasonVoteScalarFieldEnum[]
  }

  /**
   * SeasonVote findMany
   */
  export type SeasonVoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * Filter, which SeasonVotes to fetch.
     */
    where?: SeasonVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonVotes to fetch.
     */
    orderBy?: SeasonVoteOrderByWithRelationInput | SeasonVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeasonVotes.
     */
    cursor?: SeasonVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonVotes.
     */
    skip?: number
    distinct?: SeasonVoteScalarFieldEnum | SeasonVoteScalarFieldEnum[]
  }

  /**
   * SeasonVote create
   */
  export type SeasonVoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * The data needed to create a SeasonVote.
     */
    data: XOR<SeasonVoteCreateInput, SeasonVoteUncheckedCreateInput>
  }

  /**
   * SeasonVote createMany
   */
  export type SeasonVoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeasonVotes.
     */
    data: SeasonVoteCreateManyInput | SeasonVoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeasonVote createManyAndReturn
   */
  export type SeasonVoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * The data used to create many SeasonVotes.
     */
    data: SeasonVoteCreateManyInput | SeasonVoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SeasonVote update
   */
  export type SeasonVoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * The data needed to update a SeasonVote.
     */
    data: XOR<SeasonVoteUpdateInput, SeasonVoteUncheckedUpdateInput>
    /**
     * Choose, which SeasonVote to update.
     */
    where: SeasonVoteWhereUniqueInput
  }

  /**
   * SeasonVote updateMany
   */
  export type SeasonVoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeasonVotes.
     */
    data: XOR<SeasonVoteUpdateManyMutationInput, SeasonVoteUncheckedUpdateManyInput>
    /**
     * Filter which SeasonVotes to update
     */
    where?: SeasonVoteWhereInput
    /**
     * Limit how many SeasonVotes to update.
     */
    limit?: number
  }

  /**
   * SeasonVote updateManyAndReturn
   */
  export type SeasonVoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * The data used to update SeasonVotes.
     */
    data: XOR<SeasonVoteUpdateManyMutationInput, SeasonVoteUncheckedUpdateManyInput>
    /**
     * Filter which SeasonVotes to update
     */
    where?: SeasonVoteWhereInput
    /**
     * Limit how many SeasonVotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SeasonVote upsert
   */
  export type SeasonVoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * The filter to search for the SeasonVote to update in case it exists.
     */
    where: SeasonVoteWhereUniqueInput
    /**
     * In case the SeasonVote found by the `where` argument doesn't exist, create a new SeasonVote with this data.
     */
    create: XOR<SeasonVoteCreateInput, SeasonVoteUncheckedCreateInput>
    /**
     * In case the SeasonVote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeasonVoteUpdateInput, SeasonVoteUncheckedUpdateInput>
  }

  /**
   * SeasonVote delete
   */
  export type SeasonVoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
    /**
     * Filter which SeasonVote to delete.
     */
    where: SeasonVoteWhereUniqueInput
  }

  /**
   * SeasonVote deleteMany
   */
  export type SeasonVoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonVotes to delete
     */
    where?: SeasonVoteWhereInput
    /**
     * Limit how many SeasonVotes to delete.
     */
    limit?: number
  }

  /**
   * SeasonVote without action
   */
  export type SeasonVoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonVote
     */
    select?: SeasonVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeasonVote
     */
    omit?: SeasonVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeasonVoteInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    color: 'color'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const DriverScalarFieldEnum: {
    slug: 'slug',
    name: 'name',
    number: 'number',
    country: 'country',
    teamId: 'teamId',
    color: 'color'
  };

  export type DriverScalarFieldEnum = (typeof DriverScalarFieldEnum)[keyof typeof DriverScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    name: 'name',
    isAdmin: 'isAdmin',
    teamId: 'teamId',
    favoriteDriverId: 'favoriteDriverId',
    avatar: 'avatar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VoteScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    driverId: 'driverId',
    raceRound: 'raceRound',
    createdAt: 'createdAt'
  };

  export type VoteScalarFieldEnum = (typeof VoteScalarFieldEnum)[keyof typeof VoteScalarFieldEnum]


  export const SeasonVoteScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    driverId: 'driverId',
    position: 'position',
    season: 'season',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SeasonVoteScalarFieldEnum = (typeof SeasonVoteScalarFieldEnum)[keyof typeof SeasonVoteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    color?: StringNullableFilter<"Team"> | string | null
    users?: UserListRelationFilter
    drivers?: DriverListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    users?: UserOrderByRelationAggregateInput
    drivers?: DriverOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    color?: StringNullableFilter<"Team"> | string | null
    users?: UserListRelationFilter
    drivers?: DriverListRelationFilter
  }, "id" | "name">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    _count?: TeamCountOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    name?: StringWithAggregatesFilter<"Team"> | string
    color?: StringNullableWithAggregatesFilter<"Team"> | string | null
  }

  export type DriverWhereInput = {
    AND?: DriverWhereInput | DriverWhereInput[]
    OR?: DriverWhereInput[]
    NOT?: DriverWhereInput | DriverWhereInput[]
    slug?: StringFilter<"Driver"> | string
    name?: StringFilter<"Driver"> | string
    number?: IntFilter<"Driver"> | number
    country?: StringNullableFilter<"Driver"> | string | null
    teamId?: StringFilter<"Driver"> | string
    color?: StringNullableFilter<"Driver"> | string | null
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    votes?: VoteListRelationFilter
    seasonVotes?: SeasonVoteListRelationFilter
    favorited?: UserListRelationFilter
  }

  export type DriverOrderByWithRelationInput = {
    slug?: SortOrder
    name?: SortOrder
    number?: SortOrder
    country?: SortOrderInput | SortOrder
    teamId?: SortOrder
    color?: SortOrderInput | SortOrder
    team?: TeamOrderByWithRelationInput
    votes?: VoteOrderByRelationAggregateInput
    seasonVotes?: SeasonVoteOrderByRelationAggregateInput
    favorited?: UserOrderByRelationAggregateInput
  }

  export type DriverWhereUniqueInput = Prisma.AtLeast<{
    slug?: string
    AND?: DriverWhereInput | DriverWhereInput[]
    OR?: DriverWhereInput[]
    NOT?: DriverWhereInput | DriverWhereInput[]
    name?: StringFilter<"Driver"> | string
    number?: IntFilter<"Driver"> | number
    country?: StringNullableFilter<"Driver"> | string | null
    teamId?: StringFilter<"Driver"> | string
    color?: StringNullableFilter<"Driver"> | string | null
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    votes?: VoteListRelationFilter
    seasonVotes?: SeasonVoteListRelationFilter
    favorited?: UserListRelationFilter
  }, "slug">

  export type DriverOrderByWithAggregationInput = {
    slug?: SortOrder
    name?: SortOrder
    number?: SortOrder
    country?: SortOrderInput | SortOrder
    teamId?: SortOrder
    color?: SortOrderInput | SortOrder
    _count?: DriverCountOrderByAggregateInput
    _avg?: DriverAvgOrderByAggregateInput
    _max?: DriverMaxOrderByAggregateInput
    _min?: DriverMinOrderByAggregateInput
    _sum?: DriverSumOrderByAggregateInput
  }

  export type DriverScalarWhereWithAggregatesInput = {
    AND?: DriverScalarWhereWithAggregatesInput | DriverScalarWhereWithAggregatesInput[]
    OR?: DriverScalarWhereWithAggregatesInput[]
    NOT?: DriverScalarWhereWithAggregatesInput | DriverScalarWhereWithAggregatesInput[]
    slug?: StringWithAggregatesFilter<"Driver"> | string
    name?: StringWithAggregatesFilter<"Driver"> | string
    number?: IntWithAggregatesFilter<"Driver"> | number
    country?: StringNullableWithAggregatesFilter<"Driver"> | string | null
    teamId?: StringWithAggregatesFilter<"Driver"> | string
    color?: StringNullableWithAggregatesFilter<"Driver"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    isAdmin?: BoolFilter<"User"> | boolean
    teamId?: StringNullableFilter<"User"> | string | null
    favoriteDriverId?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    favoriteDriver?: XOR<DriverNullableScalarRelationFilter, DriverWhereInput> | null
    votes?: VoteListRelationFilter
    seasonVotes?: SeasonVoteListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    isAdmin?: SortOrder
    teamId?: SortOrderInput | SortOrder
    favoriteDriverId?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    team?: TeamOrderByWithRelationInput
    favoriteDriver?: DriverOrderByWithRelationInput
    votes?: VoteOrderByRelationAggregateInput
    seasonVotes?: SeasonVoteOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    isAdmin?: BoolFilter<"User"> | boolean
    teamId?: StringNullableFilter<"User"> | string | null
    favoriteDriverId?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    favoriteDriver?: XOR<DriverNullableScalarRelationFilter, DriverWhereInput> | null
    votes?: VoteListRelationFilter
    seasonVotes?: SeasonVoteListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    isAdmin?: SortOrder
    teamId?: SortOrderInput | SortOrder
    favoriteDriverId?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    isAdmin?: BoolWithAggregatesFilter<"User"> | boolean
    teamId?: StringNullableWithAggregatesFilter<"User"> | string | null
    favoriteDriverId?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type VoteWhereInput = {
    AND?: VoteWhereInput | VoteWhereInput[]
    OR?: VoteWhereInput[]
    NOT?: VoteWhereInput | VoteWhereInput[]
    id?: StringFilter<"Vote"> | string
    userId?: StringFilter<"Vote"> | string
    driverId?: StringFilter<"Vote"> | string
    raceRound?: StringFilter<"Vote"> | string
    createdAt?: DateTimeFilter<"Vote"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }

  export type VoteOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    raceRound?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    driver?: DriverOrderByWithRelationInput
  }

  export type VoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VoteWhereInput | VoteWhereInput[]
    OR?: VoteWhereInput[]
    NOT?: VoteWhereInput | VoteWhereInput[]
    userId?: StringFilter<"Vote"> | string
    driverId?: StringFilter<"Vote"> | string
    raceRound?: StringFilter<"Vote"> | string
    createdAt?: DateTimeFilter<"Vote"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }, "id">

  export type VoteOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    raceRound?: SortOrder
    createdAt?: SortOrder
    _count?: VoteCountOrderByAggregateInput
    _max?: VoteMaxOrderByAggregateInput
    _min?: VoteMinOrderByAggregateInput
  }

  export type VoteScalarWhereWithAggregatesInput = {
    AND?: VoteScalarWhereWithAggregatesInput | VoteScalarWhereWithAggregatesInput[]
    OR?: VoteScalarWhereWithAggregatesInput[]
    NOT?: VoteScalarWhereWithAggregatesInput | VoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vote"> | string
    userId?: StringWithAggregatesFilter<"Vote"> | string
    driverId?: StringWithAggregatesFilter<"Vote"> | string
    raceRound?: StringWithAggregatesFilter<"Vote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Vote"> | Date | string
  }

  export type SeasonVoteWhereInput = {
    AND?: SeasonVoteWhereInput | SeasonVoteWhereInput[]
    OR?: SeasonVoteWhereInput[]
    NOT?: SeasonVoteWhereInput | SeasonVoteWhereInput[]
    id?: StringFilter<"SeasonVote"> | string
    userId?: StringFilter<"SeasonVote"> | string
    driverId?: StringFilter<"SeasonVote"> | string
    position?: IntFilter<"SeasonVote"> | number
    season?: IntFilter<"SeasonVote"> | number
    createdAt?: DateTimeFilter<"SeasonVote"> | Date | string
    updatedAt?: DateTimeFilter<"SeasonVote"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }

  export type SeasonVoteOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    position?: SortOrder
    season?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    driver?: DriverOrderByWithRelationInput
  }

  export type SeasonVoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_position_season?: SeasonVoteUserIdPositionSeasonCompoundUniqueInput
    userId_driverId_season?: SeasonVoteUserIdDriverIdSeasonCompoundUniqueInput
    AND?: SeasonVoteWhereInput | SeasonVoteWhereInput[]
    OR?: SeasonVoteWhereInput[]
    NOT?: SeasonVoteWhereInput | SeasonVoteWhereInput[]
    userId?: StringFilter<"SeasonVote"> | string
    driverId?: StringFilter<"SeasonVote"> | string
    position?: IntFilter<"SeasonVote"> | number
    season?: IntFilter<"SeasonVote"> | number
    createdAt?: DateTimeFilter<"SeasonVote"> | Date | string
    updatedAt?: DateTimeFilter<"SeasonVote"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }, "id" | "userId_position_season" | "userId_driverId_season">

  export type SeasonVoteOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    position?: SortOrder
    season?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SeasonVoteCountOrderByAggregateInput
    _avg?: SeasonVoteAvgOrderByAggregateInput
    _max?: SeasonVoteMaxOrderByAggregateInput
    _min?: SeasonVoteMinOrderByAggregateInput
    _sum?: SeasonVoteSumOrderByAggregateInput
  }

  export type SeasonVoteScalarWhereWithAggregatesInput = {
    AND?: SeasonVoteScalarWhereWithAggregatesInput | SeasonVoteScalarWhereWithAggregatesInput[]
    OR?: SeasonVoteScalarWhereWithAggregatesInput[]
    NOT?: SeasonVoteScalarWhereWithAggregatesInput | SeasonVoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeasonVote"> | string
    userId?: StringWithAggregatesFilter<"SeasonVote"> | string
    driverId?: StringWithAggregatesFilter<"SeasonVote"> | string
    position?: IntWithAggregatesFilter<"SeasonVote"> | number
    season?: IntWithAggregatesFilter<"SeasonVote"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SeasonVote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SeasonVote"> | Date | string
  }

  export type TeamCreateInput = {
    id?: string
    name: string
    color?: string | null
    users?: UserCreateNestedManyWithoutTeamInput
    drivers?: DriverCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    name: string
    color?: string | null
    users?: UserUncheckedCreateNestedManyWithoutTeamInput
    drivers?: DriverUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUpdateManyWithoutTeamNestedInput
    drivers?: DriverUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUncheckedUpdateManyWithoutTeamNestedInput
    drivers?: DriverUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    name: string
    color?: string | null
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DriverCreateInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
    team: TeamCreateNestedOneWithoutDriversInput
    votes?: VoteCreateNestedManyWithoutDriverInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutDriverInput
    favorited?: UserCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverUncheckedCreateInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    teamId: string
    color?: string | null
    votes?: VoteUncheckedCreateNestedManyWithoutDriverInput
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutDriverInput
    favorited?: UserUncheckedCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    team?: TeamUpdateOneRequiredWithoutDriversNestedInput
    votes?: VoteUpdateManyWithoutDriverNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutDriverNestedInput
    favorited?: UserUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type DriverUncheckedUpdateInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    votes?: VoteUncheckedUpdateManyWithoutDriverNestedInput
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutDriverNestedInput
    favorited?: UserUncheckedUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type DriverCreateManyInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    teamId: string
    color?: string | null
  }

  export type DriverUpdateManyMutationInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DriverUncheckedUpdateManyInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUsersInput
    favoriteDriver?: DriverCreateNestedOneWithoutFavoritedInput
    votes?: VoteCreateNestedManyWithoutUserInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    teamId?: string | null
    favoriteDriverId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUsersNestedInput
    favoriteDriver?: DriverUpdateOneWithoutFavoritedNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    favoriteDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    teamId?: string | null
    favoriteDriverId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    favoriteDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteCreateInput = {
    id?: string
    raceRound: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutVotesInput
    driver: DriverCreateNestedOneWithoutVotesInput
  }

  export type VoteUncheckedCreateInput = {
    id?: string
    userId: string
    driverId: string
    raceRound: string
    createdAt?: Date | string
  }

  export type VoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVotesNestedInput
    driver?: DriverUpdateOneRequiredWithoutVotesNestedInput
  }

  export type VoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteCreateManyInput = {
    id?: string
    userId: string
    driverId: string
    raceRound: string
    createdAt?: Date | string
  }

  export type VoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteCreateInput = {
    id?: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSeasonVotesInput
    driver: DriverCreateNestedOneWithoutSeasonVotesInput
  }

  export type SeasonVoteUncheckedCreateInput = {
    id?: string
    userId: string
    driverId: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonVoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSeasonVotesNestedInput
    driver?: DriverUpdateOneRequiredWithoutSeasonVotesNestedInput
  }

  export type SeasonVoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteCreateManyInput = {
    id?: string
    userId: string
    driverId: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonVoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type DriverListRelationFilter = {
    every?: DriverWhereInput
    some?: DriverWhereInput
    none?: DriverWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DriverOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type VoteListRelationFilter = {
    every?: VoteWhereInput
    some?: VoteWhereInput
    none?: VoteWhereInput
  }

  export type SeasonVoteListRelationFilter = {
    every?: SeasonVoteWhereInput
    some?: SeasonVoteWhereInput
    none?: SeasonVoteWhereInput
  }

  export type VoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SeasonVoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DriverCountOrderByAggregateInput = {
    slug?: SortOrder
    name?: SortOrder
    number?: SortOrder
    country?: SortOrder
    teamId?: SortOrder
    color?: SortOrder
  }

  export type DriverAvgOrderByAggregateInput = {
    number?: SortOrder
  }

  export type DriverMaxOrderByAggregateInput = {
    slug?: SortOrder
    name?: SortOrder
    number?: SortOrder
    country?: SortOrder
    teamId?: SortOrder
    color?: SortOrder
  }

  export type DriverMinOrderByAggregateInput = {
    slug?: SortOrder
    name?: SortOrder
    number?: SortOrder
    country?: SortOrder
    teamId?: SortOrder
    color?: SortOrder
  }

  export type DriverSumOrderByAggregateInput = {
    number?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TeamNullableScalarRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
  }

  export type DriverNullableScalarRelationFilter = {
    is?: DriverWhereInput | null
    isNot?: DriverWhereInput | null
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    isAdmin?: SortOrder
    teamId?: SortOrder
    favoriteDriverId?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    isAdmin?: SortOrder
    teamId?: SortOrder
    favoriteDriverId?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    isAdmin?: SortOrder
    teamId?: SortOrder
    favoriteDriverId?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type DriverScalarRelationFilter = {
    is?: DriverWhereInput
    isNot?: DriverWhereInput
  }

  export type VoteCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    raceRound?: SortOrder
    createdAt?: SortOrder
  }

  export type VoteMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    raceRound?: SortOrder
    createdAt?: SortOrder
  }

  export type VoteMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    raceRound?: SortOrder
    createdAt?: SortOrder
  }

  export type SeasonVoteUserIdPositionSeasonCompoundUniqueInput = {
    userId: string
    position: number
    season: number
  }

  export type SeasonVoteUserIdDriverIdSeasonCompoundUniqueInput = {
    userId: string
    driverId: string
    season: number
  }

  export type SeasonVoteCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    position?: SortOrder
    season?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonVoteAvgOrderByAggregateInput = {
    position?: SortOrder
    season?: SortOrder
  }

  export type SeasonVoteMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    position?: SortOrder
    season?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonVoteMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    driverId?: SortOrder
    position?: SortOrder
    season?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonVoteSumOrderByAggregateInput = {
    position?: SortOrder
    season?: SortOrder
  }

  export type UserCreateNestedManyWithoutTeamInput = {
    create?: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput> | UserCreateWithoutTeamInput[] | UserUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamInput | UserCreateOrConnectWithoutTeamInput[]
    createMany?: UserCreateManyTeamInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DriverCreateNestedManyWithoutTeamInput = {
    create?: XOR<DriverCreateWithoutTeamInput, DriverUncheckedCreateWithoutTeamInput> | DriverCreateWithoutTeamInput[] | DriverUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: DriverCreateOrConnectWithoutTeamInput | DriverCreateOrConnectWithoutTeamInput[]
    createMany?: DriverCreateManyTeamInputEnvelope
    connect?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput> | UserCreateWithoutTeamInput[] | UserUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamInput | UserCreateOrConnectWithoutTeamInput[]
    createMany?: UserCreateManyTeamInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DriverUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<DriverCreateWithoutTeamInput, DriverUncheckedCreateWithoutTeamInput> | DriverCreateWithoutTeamInput[] | DriverUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: DriverCreateOrConnectWithoutTeamInput | DriverCreateOrConnectWithoutTeamInput[]
    createMany?: DriverCreateManyTeamInputEnvelope
    connect?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateManyWithoutTeamNestedInput = {
    create?: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput> | UserCreateWithoutTeamInput[] | UserUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamInput | UserCreateOrConnectWithoutTeamInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTeamInput | UserUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: UserCreateManyTeamInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTeamInput | UserUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTeamInput | UserUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DriverUpdateManyWithoutTeamNestedInput = {
    create?: XOR<DriverCreateWithoutTeamInput, DriverUncheckedCreateWithoutTeamInput> | DriverCreateWithoutTeamInput[] | DriverUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: DriverCreateOrConnectWithoutTeamInput | DriverCreateOrConnectWithoutTeamInput[]
    upsert?: DriverUpsertWithWhereUniqueWithoutTeamInput | DriverUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: DriverCreateManyTeamInputEnvelope
    set?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    disconnect?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    delete?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    connect?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    update?: DriverUpdateWithWhereUniqueWithoutTeamInput | DriverUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: DriverUpdateManyWithWhereWithoutTeamInput | DriverUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: DriverScalarWhereInput | DriverScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput> | UserCreateWithoutTeamInput[] | UserUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamInput | UserCreateOrConnectWithoutTeamInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTeamInput | UserUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: UserCreateManyTeamInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTeamInput | UserUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTeamInput | UserUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DriverUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<DriverCreateWithoutTeamInput, DriverUncheckedCreateWithoutTeamInput> | DriverCreateWithoutTeamInput[] | DriverUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: DriverCreateOrConnectWithoutTeamInput | DriverCreateOrConnectWithoutTeamInput[]
    upsert?: DriverUpsertWithWhereUniqueWithoutTeamInput | DriverUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: DriverCreateManyTeamInputEnvelope
    set?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    disconnect?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    delete?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    connect?: DriverWhereUniqueInput | DriverWhereUniqueInput[]
    update?: DriverUpdateWithWhereUniqueWithoutTeamInput | DriverUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: DriverUpdateManyWithWhereWithoutTeamInput | DriverUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: DriverScalarWhereInput | DriverScalarWhereInput[]
  }

  export type TeamCreateNestedOneWithoutDriversInput = {
    create?: XOR<TeamCreateWithoutDriversInput, TeamUncheckedCreateWithoutDriversInput>
    connectOrCreate?: TeamCreateOrConnectWithoutDriversInput
    connect?: TeamWhereUniqueInput
  }

  export type VoteCreateNestedManyWithoutDriverInput = {
    create?: XOR<VoteCreateWithoutDriverInput, VoteUncheckedCreateWithoutDriverInput> | VoteCreateWithoutDriverInput[] | VoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutDriverInput | VoteCreateOrConnectWithoutDriverInput[]
    createMany?: VoteCreateManyDriverInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type SeasonVoteCreateNestedManyWithoutDriverInput = {
    create?: XOR<SeasonVoteCreateWithoutDriverInput, SeasonVoteUncheckedCreateWithoutDriverInput> | SeasonVoteCreateWithoutDriverInput[] | SeasonVoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutDriverInput | SeasonVoteCreateOrConnectWithoutDriverInput[]
    createMany?: SeasonVoteCreateManyDriverInputEnvelope
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutFavoriteDriverInput = {
    create?: XOR<UserCreateWithoutFavoriteDriverInput, UserUncheckedCreateWithoutFavoriteDriverInput> | UserCreateWithoutFavoriteDriverInput[] | UserUncheckedCreateWithoutFavoriteDriverInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteDriverInput | UserCreateOrConnectWithoutFavoriteDriverInput[]
    createMany?: UserCreateManyFavoriteDriverInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VoteUncheckedCreateNestedManyWithoutDriverInput = {
    create?: XOR<VoteCreateWithoutDriverInput, VoteUncheckedCreateWithoutDriverInput> | VoteCreateWithoutDriverInput[] | VoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutDriverInput | VoteCreateOrConnectWithoutDriverInput[]
    createMany?: VoteCreateManyDriverInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type SeasonVoteUncheckedCreateNestedManyWithoutDriverInput = {
    create?: XOR<SeasonVoteCreateWithoutDriverInput, SeasonVoteUncheckedCreateWithoutDriverInput> | SeasonVoteCreateWithoutDriverInput[] | SeasonVoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutDriverInput | SeasonVoteCreateOrConnectWithoutDriverInput[]
    createMany?: SeasonVoteCreateManyDriverInputEnvelope
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutFavoriteDriverInput = {
    create?: XOR<UserCreateWithoutFavoriteDriverInput, UserUncheckedCreateWithoutFavoriteDriverInput> | UserCreateWithoutFavoriteDriverInput[] | UserUncheckedCreateWithoutFavoriteDriverInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteDriverInput | UserCreateOrConnectWithoutFavoriteDriverInput[]
    createMany?: UserCreateManyFavoriteDriverInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TeamUpdateOneRequiredWithoutDriversNestedInput = {
    create?: XOR<TeamCreateWithoutDriversInput, TeamUncheckedCreateWithoutDriversInput>
    connectOrCreate?: TeamCreateOrConnectWithoutDriversInput
    upsert?: TeamUpsertWithoutDriversInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutDriversInput, TeamUpdateWithoutDriversInput>, TeamUncheckedUpdateWithoutDriversInput>
  }

  export type VoteUpdateManyWithoutDriverNestedInput = {
    create?: XOR<VoteCreateWithoutDriverInput, VoteUncheckedCreateWithoutDriverInput> | VoteCreateWithoutDriverInput[] | VoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutDriverInput | VoteCreateOrConnectWithoutDriverInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutDriverInput | VoteUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: VoteCreateManyDriverInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutDriverInput | VoteUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutDriverInput | VoteUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type SeasonVoteUpdateManyWithoutDriverNestedInput = {
    create?: XOR<SeasonVoteCreateWithoutDriverInput, SeasonVoteUncheckedCreateWithoutDriverInput> | SeasonVoteCreateWithoutDriverInput[] | SeasonVoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutDriverInput | SeasonVoteCreateOrConnectWithoutDriverInput[]
    upsert?: SeasonVoteUpsertWithWhereUniqueWithoutDriverInput | SeasonVoteUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: SeasonVoteCreateManyDriverInputEnvelope
    set?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    disconnect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    delete?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    update?: SeasonVoteUpdateWithWhereUniqueWithoutDriverInput | SeasonVoteUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: SeasonVoteUpdateManyWithWhereWithoutDriverInput | SeasonVoteUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: SeasonVoteScalarWhereInput | SeasonVoteScalarWhereInput[]
  }

  export type UserUpdateManyWithoutFavoriteDriverNestedInput = {
    create?: XOR<UserCreateWithoutFavoriteDriverInput, UserUncheckedCreateWithoutFavoriteDriverInput> | UserCreateWithoutFavoriteDriverInput[] | UserUncheckedCreateWithoutFavoriteDriverInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteDriverInput | UserCreateOrConnectWithoutFavoriteDriverInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFavoriteDriverInput | UserUpsertWithWhereUniqueWithoutFavoriteDriverInput[]
    createMany?: UserCreateManyFavoriteDriverInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFavoriteDriverInput | UserUpdateWithWhereUniqueWithoutFavoriteDriverInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFavoriteDriverInput | UserUpdateManyWithWhereWithoutFavoriteDriverInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VoteUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: XOR<VoteCreateWithoutDriverInput, VoteUncheckedCreateWithoutDriverInput> | VoteCreateWithoutDriverInput[] | VoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutDriverInput | VoteCreateOrConnectWithoutDriverInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutDriverInput | VoteUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: VoteCreateManyDriverInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutDriverInput | VoteUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutDriverInput | VoteUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type SeasonVoteUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: XOR<SeasonVoteCreateWithoutDriverInput, SeasonVoteUncheckedCreateWithoutDriverInput> | SeasonVoteCreateWithoutDriverInput[] | SeasonVoteUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutDriverInput | SeasonVoteCreateOrConnectWithoutDriverInput[]
    upsert?: SeasonVoteUpsertWithWhereUniqueWithoutDriverInput | SeasonVoteUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: SeasonVoteCreateManyDriverInputEnvelope
    set?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    disconnect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    delete?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    update?: SeasonVoteUpdateWithWhereUniqueWithoutDriverInput | SeasonVoteUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: SeasonVoteUpdateManyWithWhereWithoutDriverInput | SeasonVoteUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: SeasonVoteScalarWhereInput | SeasonVoteScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutFavoriteDriverNestedInput = {
    create?: XOR<UserCreateWithoutFavoriteDriverInput, UserUncheckedCreateWithoutFavoriteDriverInput> | UserCreateWithoutFavoriteDriverInput[] | UserUncheckedCreateWithoutFavoriteDriverInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteDriverInput | UserCreateOrConnectWithoutFavoriteDriverInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFavoriteDriverInput | UserUpsertWithWhereUniqueWithoutFavoriteDriverInput[]
    createMany?: UserCreateManyFavoriteDriverInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFavoriteDriverInput | UserUpdateWithWhereUniqueWithoutFavoriteDriverInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFavoriteDriverInput | UserUpdateManyWithWhereWithoutFavoriteDriverInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type TeamCreateNestedOneWithoutUsersInput = {
    create?: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutUsersInput
    connect?: TeamWhereUniqueInput
  }

  export type DriverCreateNestedOneWithoutFavoritedInput = {
    create?: XOR<DriverCreateWithoutFavoritedInput, DriverUncheckedCreateWithoutFavoritedInput>
    connectOrCreate?: DriverCreateOrConnectWithoutFavoritedInput
    connect?: DriverWhereUniqueInput
  }

  export type VoteCreateNestedManyWithoutUserInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type SeasonVoteCreateNestedManyWithoutUserInput = {
    create?: XOR<SeasonVoteCreateWithoutUserInput, SeasonVoteUncheckedCreateWithoutUserInput> | SeasonVoteCreateWithoutUserInput[] | SeasonVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutUserInput | SeasonVoteCreateOrConnectWithoutUserInput[]
    createMany?: SeasonVoteCreateManyUserInputEnvelope
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
  }

  export type VoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type SeasonVoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SeasonVoteCreateWithoutUserInput, SeasonVoteUncheckedCreateWithoutUserInput> | SeasonVoteCreateWithoutUserInput[] | SeasonVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutUserInput | SeasonVoteCreateOrConnectWithoutUserInput[]
    createMany?: SeasonVoteCreateManyUserInputEnvelope
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TeamUpdateOneWithoutUsersNestedInput = {
    create?: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutUsersInput
    upsert?: TeamUpsertWithoutUsersInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutUsersInput, TeamUpdateWithoutUsersInput>, TeamUncheckedUpdateWithoutUsersInput>
  }

  export type DriverUpdateOneWithoutFavoritedNestedInput = {
    create?: XOR<DriverCreateWithoutFavoritedInput, DriverUncheckedCreateWithoutFavoritedInput>
    connectOrCreate?: DriverCreateOrConnectWithoutFavoritedInput
    upsert?: DriverUpsertWithoutFavoritedInput
    disconnect?: DriverWhereInput | boolean
    delete?: DriverWhereInput | boolean
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutFavoritedInput, DriverUpdateWithoutFavoritedInput>, DriverUncheckedUpdateWithoutFavoritedInput>
  }

  export type VoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutUserInput | VoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutUserInput | VoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutUserInput | VoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type SeasonVoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<SeasonVoteCreateWithoutUserInput, SeasonVoteUncheckedCreateWithoutUserInput> | SeasonVoteCreateWithoutUserInput[] | SeasonVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutUserInput | SeasonVoteCreateOrConnectWithoutUserInput[]
    upsert?: SeasonVoteUpsertWithWhereUniqueWithoutUserInput | SeasonVoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SeasonVoteCreateManyUserInputEnvelope
    set?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    disconnect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    delete?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    update?: SeasonVoteUpdateWithWhereUniqueWithoutUserInput | SeasonVoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SeasonVoteUpdateManyWithWhereWithoutUserInput | SeasonVoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SeasonVoteScalarWhereInput | SeasonVoteScalarWhereInput[]
  }

  export type VoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutUserInput | VoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutUserInput | VoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutUserInput | VoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type SeasonVoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SeasonVoteCreateWithoutUserInput, SeasonVoteUncheckedCreateWithoutUserInput> | SeasonVoteCreateWithoutUserInput[] | SeasonVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SeasonVoteCreateOrConnectWithoutUserInput | SeasonVoteCreateOrConnectWithoutUserInput[]
    upsert?: SeasonVoteUpsertWithWhereUniqueWithoutUserInput | SeasonVoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SeasonVoteCreateManyUserInputEnvelope
    set?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    disconnect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    delete?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    connect?: SeasonVoteWhereUniqueInput | SeasonVoteWhereUniqueInput[]
    update?: SeasonVoteUpdateWithWhereUniqueWithoutUserInput | SeasonVoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SeasonVoteUpdateManyWithWhereWithoutUserInput | SeasonVoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SeasonVoteScalarWhereInput | SeasonVoteScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutVotesInput = {
    create?: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVotesInput
    connect?: UserWhereUniqueInput
  }

  export type DriverCreateNestedOneWithoutVotesInput = {
    create?: XOR<DriverCreateWithoutVotesInput, DriverUncheckedCreateWithoutVotesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutVotesInput
    connect?: DriverWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVotesInput
    upsert?: UserUpsertWithoutVotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVotesInput, UserUpdateWithoutVotesInput>, UserUncheckedUpdateWithoutVotesInput>
  }

  export type DriverUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<DriverCreateWithoutVotesInput, DriverUncheckedCreateWithoutVotesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutVotesInput
    upsert?: DriverUpsertWithoutVotesInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutVotesInput, DriverUpdateWithoutVotesInput>, DriverUncheckedUpdateWithoutVotesInput>
  }

  export type UserCreateNestedOneWithoutSeasonVotesInput = {
    create?: XOR<UserCreateWithoutSeasonVotesInput, UserUncheckedCreateWithoutSeasonVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSeasonVotesInput
    connect?: UserWhereUniqueInput
  }

  export type DriverCreateNestedOneWithoutSeasonVotesInput = {
    create?: XOR<DriverCreateWithoutSeasonVotesInput, DriverUncheckedCreateWithoutSeasonVotesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutSeasonVotesInput
    connect?: DriverWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSeasonVotesNestedInput = {
    create?: XOR<UserCreateWithoutSeasonVotesInput, UserUncheckedCreateWithoutSeasonVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSeasonVotesInput
    upsert?: UserUpsertWithoutSeasonVotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSeasonVotesInput, UserUpdateWithoutSeasonVotesInput>, UserUncheckedUpdateWithoutSeasonVotesInput>
  }

  export type DriverUpdateOneRequiredWithoutSeasonVotesNestedInput = {
    create?: XOR<DriverCreateWithoutSeasonVotesInput, DriverUncheckedCreateWithoutSeasonVotesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutSeasonVotesInput
    upsert?: DriverUpsertWithoutSeasonVotesInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutSeasonVotesInput, DriverUpdateWithoutSeasonVotesInput>, DriverUncheckedUpdateWithoutSeasonVotesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserCreateWithoutTeamInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    favoriteDriver?: DriverCreateNestedOneWithoutFavoritedInput
    votes?: VoteCreateNestedManyWithoutUserInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTeamInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    favoriteDriverId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTeamInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput>
  }

  export type UserCreateManyTeamInputEnvelope = {
    data: UserCreateManyTeamInput | UserCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type DriverCreateWithoutTeamInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
    votes?: VoteCreateNestedManyWithoutDriverInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutDriverInput
    favorited?: UserCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverUncheckedCreateWithoutTeamInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
    votes?: VoteUncheckedCreateNestedManyWithoutDriverInput
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutDriverInput
    favorited?: UserUncheckedCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverCreateOrConnectWithoutTeamInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutTeamInput, DriverUncheckedCreateWithoutTeamInput>
  }

  export type DriverCreateManyTeamInputEnvelope = {
    data: DriverCreateManyTeamInput | DriverCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTeamInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTeamInput, UserUncheckedUpdateWithoutTeamInput>
    create: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTeamInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTeamInput, UserUncheckedUpdateWithoutTeamInput>
  }

  export type UserUpdateManyWithWhereWithoutTeamInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTeamInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    isAdmin?: BoolFilter<"User"> | boolean
    teamId?: StringNullableFilter<"User"> | string | null
    favoriteDriverId?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type DriverUpsertWithWhereUniqueWithoutTeamInput = {
    where: DriverWhereUniqueInput
    update: XOR<DriverUpdateWithoutTeamInput, DriverUncheckedUpdateWithoutTeamInput>
    create: XOR<DriverCreateWithoutTeamInput, DriverUncheckedCreateWithoutTeamInput>
  }

  export type DriverUpdateWithWhereUniqueWithoutTeamInput = {
    where: DriverWhereUniqueInput
    data: XOR<DriverUpdateWithoutTeamInput, DriverUncheckedUpdateWithoutTeamInput>
  }

  export type DriverUpdateManyWithWhereWithoutTeamInput = {
    where: DriverScalarWhereInput
    data: XOR<DriverUpdateManyMutationInput, DriverUncheckedUpdateManyWithoutTeamInput>
  }

  export type DriverScalarWhereInput = {
    AND?: DriverScalarWhereInput | DriverScalarWhereInput[]
    OR?: DriverScalarWhereInput[]
    NOT?: DriverScalarWhereInput | DriverScalarWhereInput[]
    slug?: StringFilter<"Driver"> | string
    name?: StringFilter<"Driver"> | string
    number?: IntFilter<"Driver"> | number
    country?: StringNullableFilter<"Driver"> | string | null
    teamId?: StringFilter<"Driver"> | string
    color?: StringNullableFilter<"Driver"> | string | null
  }

  export type TeamCreateWithoutDriversInput = {
    id?: string
    name: string
    color?: string | null
    users?: UserCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutDriversInput = {
    id?: string
    name: string
    color?: string | null
    users?: UserUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutDriversInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutDriversInput, TeamUncheckedCreateWithoutDriversInput>
  }

  export type VoteCreateWithoutDriverInput = {
    id?: string
    raceRound: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutVotesInput
  }

  export type VoteUncheckedCreateWithoutDriverInput = {
    id?: string
    userId: string
    raceRound: string
    createdAt?: Date | string
  }

  export type VoteCreateOrConnectWithoutDriverInput = {
    where: VoteWhereUniqueInput
    create: XOR<VoteCreateWithoutDriverInput, VoteUncheckedCreateWithoutDriverInput>
  }

  export type VoteCreateManyDriverInputEnvelope = {
    data: VoteCreateManyDriverInput | VoteCreateManyDriverInput[]
    skipDuplicates?: boolean
  }

  export type SeasonVoteCreateWithoutDriverInput = {
    id?: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSeasonVotesInput
  }

  export type SeasonVoteUncheckedCreateWithoutDriverInput = {
    id?: string
    userId: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonVoteCreateOrConnectWithoutDriverInput = {
    where: SeasonVoteWhereUniqueInput
    create: XOR<SeasonVoteCreateWithoutDriverInput, SeasonVoteUncheckedCreateWithoutDriverInput>
  }

  export type SeasonVoteCreateManyDriverInputEnvelope = {
    data: SeasonVoteCreateManyDriverInput | SeasonVoteCreateManyDriverInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutFavoriteDriverInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUsersInput
    votes?: VoteCreateNestedManyWithoutUserInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFavoriteDriverInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    teamId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFavoriteDriverInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFavoriteDriverInput, UserUncheckedCreateWithoutFavoriteDriverInput>
  }

  export type UserCreateManyFavoriteDriverInputEnvelope = {
    data: UserCreateManyFavoriteDriverInput | UserCreateManyFavoriteDriverInput[]
    skipDuplicates?: boolean
  }

  export type TeamUpsertWithoutDriversInput = {
    update: XOR<TeamUpdateWithoutDriversInput, TeamUncheckedUpdateWithoutDriversInput>
    create: XOR<TeamCreateWithoutDriversInput, TeamUncheckedCreateWithoutDriversInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutDriversInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutDriversInput, TeamUncheckedUpdateWithoutDriversInput>
  }

  export type TeamUpdateWithoutDriversInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutDriversInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type VoteUpsertWithWhereUniqueWithoutDriverInput = {
    where: VoteWhereUniqueInput
    update: XOR<VoteUpdateWithoutDriverInput, VoteUncheckedUpdateWithoutDriverInput>
    create: XOR<VoteCreateWithoutDriverInput, VoteUncheckedCreateWithoutDriverInput>
  }

  export type VoteUpdateWithWhereUniqueWithoutDriverInput = {
    where: VoteWhereUniqueInput
    data: XOR<VoteUpdateWithoutDriverInput, VoteUncheckedUpdateWithoutDriverInput>
  }

  export type VoteUpdateManyWithWhereWithoutDriverInput = {
    where: VoteScalarWhereInput
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyWithoutDriverInput>
  }

  export type VoteScalarWhereInput = {
    AND?: VoteScalarWhereInput | VoteScalarWhereInput[]
    OR?: VoteScalarWhereInput[]
    NOT?: VoteScalarWhereInput | VoteScalarWhereInput[]
    id?: StringFilter<"Vote"> | string
    userId?: StringFilter<"Vote"> | string
    driverId?: StringFilter<"Vote"> | string
    raceRound?: StringFilter<"Vote"> | string
    createdAt?: DateTimeFilter<"Vote"> | Date | string
  }

  export type SeasonVoteUpsertWithWhereUniqueWithoutDriverInput = {
    where: SeasonVoteWhereUniqueInput
    update: XOR<SeasonVoteUpdateWithoutDriverInput, SeasonVoteUncheckedUpdateWithoutDriverInput>
    create: XOR<SeasonVoteCreateWithoutDriverInput, SeasonVoteUncheckedCreateWithoutDriverInput>
  }

  export type SeasonVoteUpdateWithWhereUniqueWithoutDriverInput = {
    where: SeasonVoteWhereUniqueInput
    data: XOR<SeasonVoteUpdateWithoutDriverInput, SeasonVoteUncheckedUpdateWithoutDriverInput>
  }

  export type SeasonVoteUpdateManyWithWhereWithoutDriverInput = {
    where: SeasonVoteScalarWhereInput
    data: XOR<SeasonVoteUpdateManyMutationInput, SeasonVoteUncheckedUpdateManyWithoutDriverInput>
  }

  export type SeasonVoteScalarWhereInput = {
    AND?: SeasonVoteScalarWhereInput | SeasonVoteScalarWhereInput[]
    OR?: SeasonVoteScalarWhereInput[]
    NOT?: SeasonVoteScalarWhereInput | SeasonVoteScalarWhereInput[]
    id?: StringFilter<"SeasonVote"> | string
    userId?: StringFilter<"SeasonVote"> | string
    driverId?: StringFilter<"SeasonVote"> | string
    position?: IntFilter<"SeasonVote"> | number
    season?: IntFilter<"SeasonVote"> | number
    createdAt?: DateTimeFilter<"SeasonVote"> | Date | string
    updatedAt?: DateTimeFilter<"SeasonVote"> | Date | string
  }

  export type UserUpsertWithWhereUniqueWithoutFavoriteDriverInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutFavoriteDriverInput, UserUncheckedUpdateWithoutFavoriteDriverInput>
    create: XOR<UserCreateWithoutFavoriteDriverInput, UserUncheckedCreateWithoutFavoriteDriverInput>
  }

  export type UserUpdateWithWhereUniqueWithoutFavoriteDriverInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutFavoriteDriverInput, UserUncheckedUpdateWithoutFavoriteDriverInput>
  }

  export type UserUpdateManyWithWhereWithoutFavoriteDriverInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutFavoriteDriverInput>
  }

  export type TeamCreateWithoutUsersInput = {
    id?: string
    name: string
    color?: string | null
    drivers?: DriverCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    color?: string | null
    drivers?: DriverUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutUsersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput>
  }

  export type DriverCreateWithoutFavoritedInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
    team: TeamCreateNestedOneWithoutDriversInput
    votes?: VoteCreateNestedManyWithoutDriverInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutDriverInput
  }

  export type DriverUncheckedCreateWithoutFavoritedInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    teamId: string
    color?: string | null
    votes?: VoteUncheckedCreateNestedManyWithoutDriverInput
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutDriverInput
  }

  export type DriverCreateOrConnectWithoutFavoritedInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutFavoritedInput, DriverUncheckedCreateWithoutFavoritedInput>
  }

  export type VoteCreateWithoutUserInput = {
    id?: string
    raceRound: string
    createdAt?: Date | string
    driver: DriverCreateNestedOneWithoutVotesInput
  }

  export type VoteUncheckedCreateWithoutUserInput = {
    id?: string
    driverId: string
    raceRound: string
    createdAt?: Date | string
  }

  export type VoteCreateOrConnectWithoutUserInput = {
    where: VoteWhereUniqueInput
    create: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput>
  }

  export type VoteCreateManyUserInputEnvelope = {
    data: VoteCreateManyUserInput | VoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SeasonVoteCreateWithoutUserInput = {
    id?: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    driver: DriverCreateNestedOneWithoutSeasonVotesInput
  }

  export type SeasonVoteUncheckedCreateWithoutUserInput = {
    id?: string
    driverId: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonVoteCreateOrConnectWithoutUserInput = {
    where: SeasonVoteWhereUniqueInput
    create: XOR<SeasonVoteCreateWithoutUserInput, SeasonVoteUncheckedCreateWithoutUserInput>
  }

  export type SeasonVoteCreateManyUserInputEnvelope = {
    data: SeasonVoteCreateManyUserInput | SeasonVoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TeamUpsertWithoutUsersInput = {
    update: XOR<TeamUpdateWithoutUsersInput, TeamUncheckedUpdateWithoutUsersInput>
    create: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutUsersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutUsersInput, TeamUncheckedUpdateWithoutUsersInput>
  }

  export type TeamUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    drivers?: DriverUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    drivers?: DriverUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type DriverUpsertWithoutFavoritedInput = {
    update: XOR<DriverUpdateWithoutFavoritedInput, DriverUncheckedUpdateWithoutFavoritedInput>
    create: XOR<DriverCreateWithoutFavoritedInput, DriverUncheckedCreateWithoutFavoritedInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutFavoritedInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutFavoritedInput, DriverUncheckedUpdateWithoutFavoritedInput>
  }

  export type DriverUpdateWithoutFavoritedInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    team?: TeamUpdateOneRequiredWithoutDriversNestedInput
    votes?: VoteUpdateManyWithoutDriverNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutDriverNestedInput
  }

  export type DriverUncheckedUpdateWithoutFavoritedInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    votes?: VoteUncheckedUpdateManyWithoutDriverNestedInput
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutDriverNestedInput
  }

  export type VoteUpsertWithWhereUniqueWithoutUserInput = {
    where: VoteWhereUniqueInput
    update: XOR<VoteUpdateWithoutUserInput, VoteUncheckedUpdateWithoutUserInput>
    create: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput>
  }

  export type VoteUpdateWithWhereUniqueWithoutUserInput = {
    where: VoteWhereUniqueInput
    data: XOR<VoteUpdateWithoutUserInput, VoteUncheckedUpdateWithoutUserInput>
  }

  export type VoteUpdateManyWithWhereWithoutUserInput = {
    where: VoteScalarWhereInput
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyWithoutUserInput>
  }

  export type SeasonVoteUpsertWithWhereUniqueWithoutUserInput = {
    where: SeasonVoteWhereUniqueInput
    update: XOR<SeasonVoteUpdateWithoutUserInput, SeasonVoteUncheckedUpdateWithoutUserInput>
    create: XOR<SeasonVoteCreateWithoutUserInput, SeasonVoteUncheckedCreateWithoutUserInput>
  }

  export type SeasonVoteUpdateWithWhereUniqueWithoutUserInput = {
    where: SeasonVoteWhereUniqueInput
    data: XOR<SeasonVoteUpdateWithoutUserInput, SeasonVoteUncheckedUpdateWithoutUserInput>
  }

  export type SeasonVoteUpdateManyWithWhereWithoutUserInput = {
    where: SeasonVoteScalarWhereInput
    data: XOR<SeasonVoteUpdateManyMutationInput, SeasonVoteUncheckedUpdateManyWithoutUserInput>
  }

  export type UserCreateWithoutVotesInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUsersInput
    favoriteDriver?: DriverCreateNestedOneWithoutFavoritedInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVotesInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    teamId?: string | null
    favoriteDriverId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
  }

  export type DriverCreateWithoutVotesInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
    team: TeamCreateNestedOneWithoutDriversInput
    seasonVotes?: SeasonVoteCreateNestedManyWithoutDriverInput
    favorited?: UserCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverUncheckedCreateWithoutVotesInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    teamId: string
    color?: string | null
    seasonVotes?: SeasonVoteUncheckedCreateNestedManyWithoutDriverInput
    favorited?: UserUncheckedCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverCreateOrConnectWithoutVotesInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutVotesInput, DriverUncheckedCreateWithoutVotesInput>
  }

  export type UserUpsertWithoutVotesInput = {
    update: XOR<UserUpdateWithoutVotesInput, UserUncheckedUpdateWithoutVotesInput>
    create: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVotesInput, UserUncheckedUpdateWithoutVotesInput>
  }

  export type UserUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUsersNestedInput
    favoriteDriver?: DriverUpdateOneWithoutFavoritedNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    favoriteDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DriverUpsertWithoutVotesInput = {
    update: XOR<DriverUpdateWithoutVotesInput, DriverUncheckedUpdateWithoutVotesInput>
    create: XOR<DriverCreateWithoutVotesInput, DriverUncheckedCreateWithoutVotesInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutVotesInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutVotesInput, DriverUncheckedUpdateWithoutVotesInput>
  }

  export type DriverUpdateWithoutVotesInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    team?: TeamUpdateOneRequiredWithoutDriversNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutDriverNestedInput
    favorited?: UserUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type DriverUncheckedUpdateWithoutVotesInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutDriverNestedInput
    favorited?: UserUncheckedUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type UserCreateWithoutSeasonVotesInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUsersInput
    favoriteDriver?: DriverCreateNestedOneWithoutFavoritedInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSeasonVotesInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    teamId?: string | null
    favoriteDriverId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSeasonVotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSeasonVotesInput, UserUncheckedCreateWithoutSeasonVotesInput>
  }

  export type DriverCreateWithoutSeasonVotesInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
    team: TeamCreateNestedOneWithoutDriversInput
    votes?: VoteCreateNestedManyWithoutDriverInput
    favorited?: UserCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverUncheckedCreateWithoutSeasonVotesInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    teamId: string
    color?: string | null
    votes?: VoteUncheckedCreateNestedManyWithoutDriverInput
    favorited?: UserUncheckedCreateNestedManyWithoutFavoriteDriverInput
  }

  export type DriverCreateOrConnectWithoutSeasonVotesInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutSeasonVotesInput, DriverUncheckedCreateWithoutSeasonVotesInput>
  }

  export type UserUpsertWithoutSeasonVotesInput = {
    update: XOR<UserUpdateWithoutSeasonVotesInput, UserUncheckedUpdateWithoutSeasonVotesInput>
    create: XOR<UserCreateWithoutSeasonVotesInput, UserUncheckedCreateWithoutSeasonVotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSeasonVotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSeasonVotesInput, UserUncheckedUpdateWithoutSeasonVotesInput>
  }

  export type UserUpdateWithoutSeasonVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUsersNestedInput
    favoriteDriver?: DriverUpdateOneWithoutFavoritedNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSeasonVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    favoriteDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DriverUpsertWithoutSeasonVotesInput = {
    update: XOR<DriverUpdateWithoutSeasonVotesInput, DriverUncheckedUpdateWithoutSeasonVotesInput>
    create: XOR<DriverCreateWithoutSeasonVotesInput, DriverUncheckedCreateWithoutSeasonVotesInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutSeasonVotesInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutSeasonVotesInput, DriverUncheckedUpdateWithoutSeasonVotesInput>
  }

  export type DriverUpdateWithoutSeasonVotesInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    team?: TeamUpdateOneRequiredWithoutDriversNestedInput
    votes?: VoteUpdateManyWithoutDriverNestedInput
    favorited?: UserUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type DriverUncheckedUpdateWithoutSeasonVotesInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    votes?: VoteUncheckedUpdateManyWithoutDriverNestedInput
    favorited?: UserUncheckedUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type UserCreateManyTeamInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    favoriteDriverId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriverCreateManyTeamInput = {
    slug: string
    name: string
    number: number
    country?: string | null
    color?: string | null
  }

  export type UserUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favoriteDriver?: DriverUpdateOneWithoutFavoritedNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    favoriteDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    favoriteDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriverUpdateWithoutTeamInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    votes?: VoteUpdateManyWithoutDriverNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutDriverNestedInput
    favorited?: UserUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type DriverUncheckedUpdateWithoutTeamInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    votes?: VoteUncheckedUpdateManyWithoutDriverNestedInput
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutDriverNestedInput
    favorited?: UserUncheckedUpdateManyWithoutFavoriteDriverNestedInput
  }

  export type DriverUncheckedUpdateManyWithoutTeamInput = {
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    country?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VoteCreateManyDriverInput = {
    id?: string
    userId: string
    raceRound: string
    createdAt?: Date | string
  }

  export type SeasonVoteCreateManyDriverInput = {
    id?: string
    userId: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateManyFavoriteDriverInput = {
    id?: string
    username: string
    password: string
    name?: string | null
    isAdmin?: boolean
    teamId?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VoteUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVotesNestedInput
  }

  export type VoteUncheckedUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteUncheckedUpdateManyWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSeasonVotesNestedInput
  }

  export type SeasonVoteUncheckedUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteUncheckedUpdateManyWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutFavoriteDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUsersNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
    seasonVotes?: SeasonVoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFavoriteDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
    seasonVotes?: SeasonVoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutFavoriteDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteCreateManyUserInput = {
    id?: string
    driverId: string
    raceRound: string
    createdAt?: Date | string
  }

  export type SeasonVoteCreateManyUserInput = {
    id?: string
    driverId: string
    position: number
    season?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutVotesNestedInput
  }

  export type VoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    raceRound?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutSeasonVotesNestedInput
  }

  export type SeasonVoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonVoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    driverId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    season?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}