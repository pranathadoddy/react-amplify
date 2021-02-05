import { withAuthenticator } from "aws-amplify-react";

function App() {
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-out">
     
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true});
