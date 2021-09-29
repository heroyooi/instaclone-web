import { useReactiveVar, useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      username
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(() => {
    console.log(data);
    if (data?.me !== undefined && data.me === null) {
      console.log("there is data");
    }
  }, [data]);
  return;
}

export default useUser;
