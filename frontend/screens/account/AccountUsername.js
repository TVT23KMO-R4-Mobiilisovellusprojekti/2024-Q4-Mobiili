import React, { } from 'react';
import { ScrollView } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';

export const AccountUsername = () => {

  // tähän sitten juttua käyttäjänimen vaihdosta
  // kts. firestoreUsers:
  //  updateUsersData   

  // sitä sovittamalla voisi ehkä saada toimimaan
  
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Change Account Username?" />

      <BasicSection>
        Eli nyt pääsee rakentamaan tänne käyttäjänimen vaihtoon liittyviä juttuja.
      </BasicSection>

      {/* tänne sitten mm. kentät, painikkeet yms, mistä nimeä vaihdetaan */}


    </ScrollView>
  );
};

export default AccountUsername;
