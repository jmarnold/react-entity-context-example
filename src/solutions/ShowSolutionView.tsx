import { SolutionProvider, useSolution } from "./SolutionContext";
import logo from "../logo.svg";
import { saveSolution } from "./SolutionCommands";

export const ShowSolutionShell: React.FC = () => {
  // Could easily expose a refresh here
  const { current, dispatcher, loading, refresh } = useSolution();

  const clickHandler = async () => {
    await dispatcher.dispatch(saveSolution({
      id: current?.id as string,
      title: 'Edited',
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        {loading && <img src={logo} className="App-logo" alt="logo" />}
        {!loading && (
          <>
            <h3>
              {current?.title} (Solution {current?.id})
            </h3>
            <button onClick={clickHandler}>Modify</button><br/>
            <button onClick={refresh}>Refresh</button>
          </>
        )}
      </header>
    </div>
  );
};

const ShowSolutionController: React.FC = () => {
  // Grab it from the params
  return (
    <SolutionProvider id="1000">
      <ShowSolutionShell />
    </SolutionProvider>
  );
};

export default ShowSolutionController;
