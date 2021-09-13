# Instaclone Web

## 8.1 Installing All

```command
npx create-react-app instaclone-web
npm i styled-components react-hook-form@6.15.1 react-router-dom @apollo/client graphql react-helmet-async

npm i --save @fortawesome/fontawesome-svg-core
  npm install --save @fortawesome/free-solid-svg-icons
  npm install --save @fortawesome/react-fontawesome

npm install --save @fortawesome/free-brands-svg-icons
  npm install --save @fortawesome/free-regular-svg-icons
```

## 8.3 Router Setup part One

- react-router-dom의 Switch를 사용하는 이유 => 한 번에 하나의 route만 render하고 싶기 때문

## 8.9 GlobalStyles on Styled Components

```command
npm i styled-reset
```

## 10.6 Helmet Component

```command
npm i prop-types
```

```js
import { Helmet } from "react-helmet-async";

function PageTitle({ title }) {
  return <Helmet>{title} | Instaclone</Helmet>;
}

export default PageTitle;
```

## 10.7 React Hook Form

```js
function Login() {
  const { register, watch, handleSubmit } = useForm();
  console.log(watch());
  const onSubmitValid = (data) => {
    console.log(data);
  };
  const onSubmitInvalid = (data) => {
    console.log(data, "invalid");
  };
  return (
    <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
      <Input
        ref={register({
          required: "Username is required.",
          minLength: 5,
        })}
        name="username"
        type="text"
        placeholder="Username"
      />
      <Input
        ref={register({
          required: "Password is required.",
        })}
        name="password"
        type="password"
        placeholder="Password"
      />
      <Button type="submit" value="Log in" />
    </form>
  );
}
```

## 10.8 React Hook Form is Awesome

```js
function Login() {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onChange",
  });
  const onSubmitValid = (data) => {
    //console.log(data);
  };
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmitValid)}>
      <Input
        ref={register({
          required: "Username is required.",
          minLength: {
            value: 5,
            message: "Username should be longer than 5 chars.",
          },
        })}
        name="username"
        type="text"
        placeholder="Username"
        hasError={Boolean(errors.username?.message)}
      />
      <FormError message={errors.username?.message} />
      <Input
        ref={register({
          required: "Password is required.",
        })}
        name="password"
        type="password"
        placeholder="Password"
        hasError={Boolean(errors.password?.message)}
      />
      <FormError message={errors.password?.message} />
      <Button type="submit" value="Log in" disabled={!formState.isValid} />
    </form>
  );
}
```

- erros는 form이 에러에 실시간으로 반응할 수 있게 해주는 기능

## 10.9 Apollo Client

```js (apollo.js)
import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);
export const darkModeVar = makeVar(false);
export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
```

- Cache 는 Apollo 가 한번 가져온 정보를 기억하게 해서, 매번 같은 정보를 가져오지 않도록 하는 것

```js
import { client, isLoggedInVar } from "./apollo";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return <ApolloProvider client={client}>{/**/}</ApolloProvider>;
}
```

- [확장 프로그램 > Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm)

## 10.10 Login part One

```js
import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const { register, handleSubmit, errors, formState, getValues, setError } =
    useForm({
      mode: "onChange",
    });
  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      setError("result", {
        message: error,
      });
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: { username, password },
    });
  };
}
```

## 참고 링크

- [듣던 강좌 #10.11](https://nomadcoders.co/instaclone/lectures/2500)
