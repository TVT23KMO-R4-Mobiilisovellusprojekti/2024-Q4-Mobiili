import React, { } from 'react';
import { ScrollView } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import SwitchingBackgrounds from '../../components/SwitchingBackgrounds';

const Credits = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <SwitchingBackgrounds />
      <Heading title="Mikä on Kierttis?" />

      <BasicSection>
        Kierttis on innovatiivinen sovellus, joka tekee kierrättämisestä helppoa ja nopeaa! 
        Meidän tavoitteemme on auttaa käyttäjiä löytämään uusi elämä käyttökelpoisille tavaroille ja tukea kestävämpää elämäntapaa kierrättämisen avulla. {"\n\n"}
        Toisen roska on toisen aarre, ja Kierttis tekee sen mahdolliseksi. Voit antaa omat tarpeettomat tavarasi eteenpäin ja löytää aarteita muilta käyttäjiltä. {"\n\n"}
        Tutustu palvelun käyttöohjeisiin ja aloita kierrättäminen Kierttiksellä jo tänään! {"\n\n"}
      </BasicSection>

      <Heading title="Käyttöohjeet" />

      <BasicSection>
        Kirjautunut käyttäjä voi julkaista ilmoituksen, joka näkyy kaikille palvelun rekisteröityneille käyttäjille suodatuksesta riippuen. {"\n\n"}
        
        Ilmoituksessa annetaan tiedot tuotteesta, sen sijainnista ja mahdollinen kuva tuotteesta. {"\n"}
        Julkaisija asettaa ilmoituksen tyypiksi "Jonotus" tai "Poiminta", joiden käytännöt hieman eroavat toisistaan. {"\n\n"}
        Jonotus -periaatteella toimitaan siten, että ensimmäinen varaaja saa viestiyhteyden ilmoittajaan ja voi sopia noudosta ja muut jäävät jonoon. {"\n"}
        Mikäli julkaisija ei merkitse tuotetta noudetuksi tai varaaja peruu varauksensa, se siirtyy seuraavalle jonossa olevalle tietyn ajan kuluessa. {"\n\n"}

        Poiminta -periaatteella varauksen yhteydessä annetaan julkaisijalle lisätietona mahdollinen noutoaika tai muu oleellinen lisätieto. Julkaisija voi jonottajista tällöin valita, kenelle tuotteen luovuttaa. {"\n"}
        Tässä tapauksessa jos varaus peruuntuu tai tuotetta ei noudeta, julkaisija voi poimia jonottajien pinosta seuraaavan hänelle sopivimman vaihtoehdon. {"\n\n"}

        Kaikissa tapauksissa toivotaan Kierttiksen puolesta mahdollisimman nopeaa noutoa. Ilmoitukset vanhenevat automaattisesti viikon kuluttua julkaisusta ja poistetaan palvelusta. {"\n"}
        Käyttäjä voi tarvittaessa julkaista ilmoituksensa uudelleen jos hänellä on käytettäviä julkaisukertoja jäljellä, mutta hänen tulee antaa tuotetiedot uudelleen. {"\n\n"}
      </BasicSection>

      <Heading title="Sovelluksen tausta" />
      <BasicSection>
          Kierttis on Oulun Ammattikorkeakoulun tietotekniikan opiskelijoiden kehittämä sovellus, joka kuuluu opintojaksoon Mobiilisovellusprojekti. {"\n\n"}

          Sovelluksen kehittäjät: {"\n\n"}
          • Rebecca Soisenniemi {"\n"}
          • Henkka Laukka {"\n"}
          • Matias Niemelä {"\n"}
          • Elina Lappalainen {"\n"}
      </BasicSection>

      <Heading title="Assettien käyttö" />
      <BasicSection>
        Palveluun sisällytetyt assetit, mm. kuvat ja fontit ovat tekijänoikeudellisesti suojattuja.{"\n"}
        Kiitämme kaikkia assettien tarjoajia tämän projektin hyväksi.{"\n\n"}
      </BasicSection>

    </ScrollView>
  );
};

export default Credits;
