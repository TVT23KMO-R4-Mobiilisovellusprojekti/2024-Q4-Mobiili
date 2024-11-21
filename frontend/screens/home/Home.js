import React, { useContext, useState } from 'react';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { ScrollView } from 'react-native';
import { Heading } from '../../components/CommonComponents';
import { Login } from "../login/Login";
import { Register } from "../login/Register";

const Home = () => {
    const {authState} = useContext(AuthenticationContext);
    const [visibleSection, setVisibleSection] = useState(null);

    const toggleSection = (sectionName) => {
      setVisibleSection((prevSection) => prevSection === sectionName ? null : sectionName);
    };

    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
          {authState ? (
            <>
            <Heading title="Olet kirjautunut.." />
             {/* Jotain kivaa kirjautuneen etusivulla*/}
            </>
        ) : (
            <>
            <Heading title="Tervetuloa käyttämään Kierttistä!" />
            <Login 
              isVisible={visibleSection === 'login'} 
              toggleVisible={() => toggleSection('login')} 
            />
            <Register 
              isVisible={visibleSection === 'register'} 
              toggleVisible={() => toggleSection('register')} 
            />
            </>
        )}
    </ScrollView>
    );
};

export default Home;