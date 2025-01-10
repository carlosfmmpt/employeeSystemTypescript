import EmployeeList from './components/EmployeeList';

const App: React.FC = () => {
  return (


    <div>
      <div className="lg:flex lg:items-center  lg:justify-between py-4 bg-blue-200">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Employee System con Typescript        </h2>
        </div>
      </div>
      <EmployeeList />
    </div>

  );
}

export default App;
