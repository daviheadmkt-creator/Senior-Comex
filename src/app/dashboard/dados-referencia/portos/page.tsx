
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';


export default function PortosPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
    const { data: portsFromDb, isLoading } = useCollection(portsCollection);

    const [formData, setFormData] = useState({ name: '', un_locode: '', country: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialPorts = [
        { id: 'AEAJM', name: 'AJMAN', un_locode: 'AEAJM', country: 'United Arab Emirates' },
        { id: 'AEAUH', name: 'ABU DHABI', un_locode: 'AEAUH', country: 'United Arab Emirates' },
        { id: 'AEDAS', name: 'DAS ISLAND', un_locode: 'AEDAS', country: 'United Arab Emirates' },
        { id: 'AEDXB', name: 'DUBAI', un_locode: 'AEDXB', country: 'United Arab Emirates' },
        { id: 'AEFAT', name: 'FATEH TERMINAL', un_locode: 'AEFAT', country: 'United Arab Emirates' },
        { id: 'AEFJR', name: 'FUJAIRAH', un_locode: 'AEFJR', country: 'United Arab Emirates' },
        { id: 'AEFMZ', name: 'MUSSAFAH', un_locode: 'AEFMZ', country: 'United Arab Emirates' },
        { id: 'AEHAM', name: 'HAMRIYAH', un_locode: 'AEHAM', country: 'United Arab Emirates' },
        { id: 'AEHZP', name: 'HAMRIYA FREE ZONE PORT', un_locode: 'AEHZP', country: 'United Arab Emirates' },
        { id: 'AEJEA', name: 'JEBEL ALI', un_locode: 'AEJEA', country: 'United Arab Emirates' },
        { id: 'AEKHL', name: 'PORT KHALIFA', un_locode: 'AEKHL', country: 'United Arab Emirates' },
        { id: 'AEKLF', name: 'KHOR FAKKAN', un_locode: 'AEKLF', country: 'United Arab Emirates' },
        { id: 'AEMSA', name: 'MINA SAQR', un_locode: 'AEMSA', country: 'United Arab Emirates' },
        { id: 'AEMZD', name: 'MINA ZAYED', un_locode: 'AEMZD', country: 'United Arab Emirates' },
        { id: 'AERKT', name: 'RAS AL KHAIMAH', un_locode: 'AERKT', country: 'United Arab Emirates' },
        { id: 'AERUW', name: 'RUWAIS', un_locode: 'AERUW', country: 'United Arab Emirates' },
        { id: 'AESHJ', name: 'SHARJAH', un_locode: 'AESHJ', country: 'United Arab Emirates' },
        { id: 'AEUAE', name: 'PORT KHALID', un_locode: 'AEUAE', country: 'United Arab Emirates' },
        { id: 'AEZZZ', name: 'OUTROS PORTOS NAO IDENTIFICADOS - EMIRADOS ARABES', un_locode: 'AEZZZ', country: 'United Arab Emirates' },
        { id: 'AGSJO', name: 'ST JOHNoS', un_locode: 'AGSJO', country: 'Antigua and Barbuda' },
        { id: 'AIRBY', name: 'ROAD BAY', un_locode: 'AIRBY', country: 'Anguilla' },
        { id: 'ALDRZ', name: 'DURRES', un_locode: 'ALDRZ', country: 'Albania' },
        { id: 'ANBON', name: 'BONAIRE', un_locode: 'ANBON', country: 'Netherlands Antilles' },
        { id: 'ANCUR', name: 'CURAÇAO', un_locode: 'ANCUR', country: 'Netherlands Antilles' },
        { id: 'ANEMM', name: 'EMMASTAD - USAR NOVO CÓDIGO CWEMM', un_locode: 'ANEMM', country: 'Netherlands Antilles' },
        { id: 'ANEUX', name: 'ST EUSTATIUS', un_locode: 'ANEUX', country: 'Netherlands Antilles' },
        { id: 'ANGES', name: 'GALIS BAY', un_locode: 'ANGES', country: 'Netherlands Antilles' },
        { id: 'ANKRA', name: 'KRALENDIJK', un_locode: 'ANKRA', country: 'Netherlands Antilles' },
        { id: 'ANPHI', name: 'PHILIPSBURG', un_locode: 'ANPHI', country: 'Netherlands Antilles' },
        { id: 'ANSXM', name: 'ST. MAARTEN', un_locode: 'ANSXM', country: 'Netherlands Antilles' },
        { id: 'ANWIL', name: 'WILLEMSTAD - USAR NOVO CÓDIO CWWIL', un_locode: 'ANWIL', country: 'Netherlands Antilles' },
        { id: 'AOAZZ', name: 'AMBRIZ', un_locode: 'AOAZZ', country: 'Angola' },
        { id: 'AOCAB', name: 'CABINDA', un_locode: 'AOCAB', country: 'Angola' },
        { id: 'AODAL', name: 'DALIA TERMINAL', un_locode: 'AODAL', country: 'Angola' },
        { id: 'AOLAD', name: 'LUANDA', un_locode: 'AOLAD', country: 'Angola' },
        { id: 'AOLOB', name: 'LOBITO', un_locode: 'AOLOB', country: 'Angola' },
        { id: 'AOMAL', name: 'MALONGO', un_locode: 'AOMAL', country: 'Angola' },
        { id: 'AOMSZ', name: 'MOSSAMEDES (NAMIBE)', un_locode: 'AOMSZ', country: 'Angola' },
        { id: 'AOPAT', name: 'PALANCA', un_locode: 'AOPAT', country: 'Angola' },
        { id: 'AOPBM', name: 'PORTO AMBOIM', un_locode: 'AOPBM', country: 'Angola' },
        { id: 'AOSZA', name: 'SOYO', un_locode: 'AOSZA', country: 'Angola' },
        { id: 'AOZZZ', name: 'OUTROS PORTOS NAO IDENTIFICADOS - ANGOLA', un_locode: 'AOZZZ', country: 'Angola' },
        { id: 'AO002', name: 'KIZOMBA B', un_locode: 'AO002', country: 'Angola' },
        { id: 'AQPLM', name: 'PORTO PALMER', un_locode: 'AQPLM', country: 'Antarctica' },
        { id: 'ARAVD', name: 'PUERTO ACEVEDO', un_locode: 'ARAVD', country: 'Argentina' },
        { id: 'ARBDE', name: 'BELÉN DE ESCOBAR', un_locode: 'ARBDE', country: 'Argentina' },
        { id: 'ARBHI', name: 'BAHIA BLANCA', un_locode: 'ARBHI', country: 'Argentina' },
        { id: 'ARBQS', name: 'BARRANQUERAS', un_locode: 'ARBQS', country: 'Argentina' },
        { id: 'ARBUE', name: 'BUENOS AIRES', un_locode: 'ARBUE', country: 'Argentina' },
        { id: 'ARCLC', name: 'CALETA CORDOVA', un_locode: 'ARCLC', country: 'Argentina' },
        { id: 'ARCMP', name: 'CAMPANA', un_locode: 'ARCMP', country: 'Argentina' },
        { id: 'ARCNQ', name: 'CORRIENTES', un_locode: 'ARCNQ', country: 'Argentina' },
        { id: 'ARCOU', name: 'CONCEPCION DEL URUGUAY', un_locode: 'ARCOU', country: 'Argentina' },
        { id: 'ARCPC', name: 'SAN MARTIN', un_locode: 'ARCPC', country: 'Argentina' },
        { id: 'ARCRD', name: 'COMODORO RIVADAVIA', un_locode: 'ARCRD', country: 'Argentina' },
        { id: 'ARCVI', name: 'CALETA OLIVIA', un_locode: 'ARCVI', country: 'Argentina' },
        { id: 'ARDDL', name: 'DELTA DOCK-LIMA', un_locode: 'ARDDL', country: 'Argentina' },
        { id: 'ARDGU', name: 'DEL GUAZU', un_locode: 'ARDGU', country: 'Argentina' },
        { id: 'ARDME', name: 'DIAMANTE', un_locode: 'ARDME', country: 'Argentina' },
        { id: 'ARGHU', name: 'GUALEGUAYCHU', un_locode: 'ARGHU', country: 'Argentina' },
        { id: 'ARIBO', name: 'INGENIERO BUITRAGO', un_locode: 'ARIBO', country: 'Argentina' },
        { id: 'ARIBY', name: 'IBICUY', un_locode: 'ARIBY', country: 'Argentina' },
        { id: 'ARINW', name: 'INGENIEIRO WHITE/BAHIA BLANCA', un_locode: 'ARINW', country: 'Argentina' },
        { id: 'ARLIM', name: 'LIMA', un_locode: 'ARLIM', country: 'Argentina' },
        { id: 'ARLPG', name: 'LA PLATA', un_locode: 'ARLPG', country: 'Argentina' },
        { id: 'ARLPS', name: 'PUERTO LAS PALMAS', un_locode: 'ARLPS', country: 'Argentina' },
        { id: 'ARMDQ', name: 'MAR DEL PLATA', un_locode: 'ARMDQ', country: 'Argentina' },
        { id: 'ARNEC', name: 'NECOCHEA (QUEQUEN)', un_locode: 'ARNEC', country: 'Argentina' },
        { id: 'AROES', name: 'SANTO ANTONIO - OESTE', un_locode: 'AROES', country: 'Argentina' },
        { id: 'ARPAL', name: 'PTO ALUMBRERA', un_locode: 'ARPAL', country: 'Argentina' },
        { id: 'ARPGV', name: 'PUERTO GALVAN', un_locode: 'ARPGV', country: 'Argentina' },
        { id: 'ARPLO', name: 'PUNTA LOYOLA', un_locode: 'ARPLO', country: 'Argentina' },
        { id: 'ARPMY', name: 'PUERTO MADRYN', un_locode: 'ARPMY', country: 'Argentina' },
        { id: 'ARPQU', name: 'PUNTA QUILLA', un_locode: 'ARPQU', country: 'Argentina' },
        { id: 'ARPRA', name: 'PARANA', un_locode: 'ARPRA', country: 'Argentina' },
        { id: 'ARPRS', name: 'PUERTO ROSALES', un_locode: 'ARPRS', country: 'Argentina' },
        { id: 'ARPUD', name: 'PUERTO DESEADO', un_locode: 'ARPUD', country: 'Argentina' },
        { id: 'ARQBR', name: 'PARANA GUAZU', un_locode: 'ARQBR', country: 'Argentina' },
        { id: 'ARRAM', name: 'RAMALLO', un_locode: 'ARRAM', country: 'Argentina' },
        { id: 'ARROC', name: 'INGENIERO ROCCA', un_locode: 'ARROC', country: 'Argentina' },
        { id: 'ARROS', name: 'ROSARIO', un_locode: 'ARROS', country: 'Argentina' },
        { id: 'ARRZA', name: 'SANTA CRUZ', un_locode: 'ARRZA', country: 'Argentina' },
        { id: 'ARSAE', name: 'SAN ANTONIO - ESTE', un_locode: 'ARSAE', country: 'Argentina' },
        { id: 'ARSFN', name: 'SANTA FE', un_locode: 'ARSFN', country: 'Argentina' },
        { id: 'ARSLA', name: 'LA PAZ', un_locode: 'ARSLA', country: 'Argentina' },
        { id: 'ARSLO', name: 'SAN LORENZO', un_locode: 'ARSLO', country: 'Argentina' },
        { id: 'ARSNS', name: 'SAN NICOLAS', un_locode: 'ARSNS', country: 'Argentina' },
        { id: 'ARSPD', name: 'SAN PEDRO', un_locode: 'ARSPD', country: 'Argentina' },
        { id: 'ARULA', name: 'SAN JULIAN', un_locode: 'ARULA', country: 'Argentina' },
        { id: 'ARUSH', name: 'USHUAIA', un_locode: 'ARUSH', country: 'Argentina' },
        { id: 'ARVCN', name: 'VILLA CONSTITUCION', un_locode: 'ARVCN', country: 'Argentina' },
        { id: 'ARZAE', name: 'ZARATE', un_locode: 'ARZAE', country: 'Argentina' },
        { id: 'ARZZZ', name: 'OUTROS PORTOS NAO IDENTIFICADOS - ARGENTINA', un_locode: 'ARZZZ', country: 'Argentina' },
        { id: 'AR007', name: 'ARROYO SECO', un_locode: 'AR007', country: 'Argentina' },
        { id: 'AR008', name: 'PUNTA ALVEAR', un_locode: 'AR008', country: 'Argentina' },
        { id: 'AR020', name: 'RIO CULLEN', un_locode: 'AR020', country: 'Argentina' },
        { id: 'AR024', name: 'DOCK SUD', un_locode: 'AR024', country: 'Argentina' },
        { id: 'ASPPG', name: 'PAGO PAGO', un_locode: 'ASPPG', country: 'American Samoa' },
        { id: 'ASPTH', name: 'PERTH', un_locode: 'ASPTH', country: 'American Samoa' },
        { id: 'AS001', name: 'LAMINARIA', un_locode: 'AS001', country: 'American Samoa' },
        { id: 'ATVIE', name: 'VIENA (WIEN)', un_locode: 'ATVIE', country: 'Austria' },
        { id: 'AUABP', name: 'ABBOT POINT', un_locode: 'AUABP', country: 'Australia' },
        { id: 'AUADL', name: 'ADELAIDE', un_locode: 'AUADL', country: 'Australia' },
        { id: 'AUAGS', name: 'AUGUSTA', un_locode: 'AUAGS', country: 'Australia' },
        { id: 'AUBBG', name: 'BING BONG', un_locode: 'AUBBG', country: 'Australia' },
        { id: 'AUBEL', name: 'BELL BAY', un_locode: 'AUBEL', country: 'Australia' },
        { id: 'AUBME', name: 'BROOME', un_locode: 'AUBME', country: 'Australia' },
        { id: 'AUBNE', name: 'BRISBANE', un_locode: 'AUBNE', country: 'Australia' },
        { id: 'AUBUY', name: 'BUNBURY', un_locode: 'AUBUY', country: 'Australia' },
        { id: 'AUBWT', name: 'BURNIE', un_locode: 'AUBWT', country: 'Australia' },
        { id: 'AUDAM', name: 'DAMPIER', un_locode: 'AUDAM', country: 'Australia' },
        { id: 'AUDRW', name: 'DARWIN', un_locode: 'AUDRW', country: 'Australia' },
        { id: 'AUEPR', name: 'ESPERANCE', un_locode: 'AUEPR', country: 'Australia' },
        { id: 'AUFRE', name: 'FREMANTLE', un_locode: 'AUFRE', country: 'Australia' },
        { id: 'AUGEX', name: 'GEELONG', un_locode: 'AUGEX', country: 'Australia' },
        { id: 'AUGLT', name: 'GLADSTONE', un_locode: 'AUGLT', country: 'Australia' },
        { id: 'AUGTT', name: 'GERALDTON', un_locode: 'AUGTT', country: 'Australia' },
        { id: 'AUHAS', name: 'HASTINGS', un_locode: 'AUHAS', country: 'Australia' },
        { id: 'AUHBA', name: 'HOBART', un_locode: 'AUHBA', country: 'Australia' },
        { id: 'AUHPT', name: 'HAY POINT', un_locode: 'AUHPT', country: 'Australia' },
        { id: 'AUKOI', name: 'KOOLAN ISLAND', un_locode: 'AUKOI', country: 'Australia' },
        { id: 'AUKWI', name: 'KWINANA', un_locode: 'AUKWI', country: 'Australia' },
        { id: 'AUMEL', name: 'MELBOURNE', un_locode: 'AUMEL', country: 'Australia' },
        { id: 'AUMKY', name: 'MACKAY', un_locode: 'AUMKY', country: 'Australia' },
        { id: 'AUMOU', name: 'MOURILYAN', un_locode: 'AUMOU', country: 'Australia' },
        { id: 'AUNTE', name: 'NORTHERN ENDEAVOUR', un_locode: 'AUNTE', country: 'Australia' },
        { id: 'AUNTL', name: 'NEWCASTLE (NEW SOUTH WALES)', un_locode: 'AUNTL', country: 'Australia' },
        { id: 'AUPAU', name: 'PORT ARTHUR', un_locode: 'AUPAU', country: 'Australia' },
        { id: 'AUPBT', name: 'PORT BOTANY', un_locode: 'AUPBT', country: 'Australia' },
        { id: 'AUPGI', name: 'PORT GILES', un_locode: 'AUPGI', country: 'Australia' },
        { id: 'AUPHE', name: 'PORT HEDLAND', un_locode: 'AUPHE', country: 'Australia' },
        { id: 'AUPKL', name: 'PORT KEMBLA', un_locode: 'AUPKL', country: 'Australia' },
        { id: 'AUPLO', name: 'PORT LINCOLN', un_locode: 'AUPLO', country: 'Australia' },
        { id: 'AUPTD', name: 'PORT DALRYMPLE', un_locode: 'AUPTD', country: 'Australia' },
        { id: 'AUPTJ', name: 'PORTLAND', un_locode: 'AUPTJ', country: 'Australia' },
        { id: 'AUPTL', name: 'PORT ALMA', un_locode: 'AUPTL', country: 'Australia' },
        { id: 'AURDN', name: 'RISDON', un_locode: 'AURDN', country: 'Australia' },
        { id: 'AUSYD', name: 'SYDNEY', un_locode: 'AUSYD', country: 'Australia' },
        { id: 'AUTSV', name: 'TOWNSVILLE', un_locode: 'AUTSV', country: 'Australia' },
        { id: 'AUWAL', name: 'WALLAROO', un_locode: 'AUWAL', country: 'Australia' },
        { id: 'AUWEI', name: 'WEIPA', un_locode: 'AUWEI', country: 'Australia' },
        { id: 'AUWEP', name: 'WESTERNPORT', un_locode: 'AUWEP', country: 'Australia' },
        { id: 'AUWYA', name: 'WHYALLA', un_locode: 'AUWYA', country: 'Australia' },
        { id: 'AUYRV', name: 'YARRAVILLE', un_locode: 'AUYRV', country: 'Australia' },
        { id: 'AUZZZ', name: 'OUTROS PORTOS NÃO IDENTIFICADOS-AUSTRALIA', un_locode: 'AUZZZ', country: 'Australia' },
        { id: 'AWAUA', name: 'ARUBA', un_locode: 'AWAUA', country: 'Aruba' },
        { id: 'AWBAR', name: 'BARCADURA', un_locode: 'AWBAR', country: 'Aruba' },
        { id: 'AWORJ', name: 'ORANJESTAD', un_locode: 'AWORJ', country: 'Aruba' },
        { id: 'AWSNL', name: 'SAN NICOLAS', un_locode: 'AWSNL', country: 'Aruba' },
        { id: 'AZBAK', name: 'BAKU', un_locode: 'AZBAK', country: 'Azerbaijan' },
        { id: 'BBBGI', name: 'BRIDGETOWN', un_locode: 'BBBGI', country: 'Barbados' },
        { id: 'BDCGP', name: 'CHITTAGONG (CHATTOGRAM)', un_locode: 'BDCGP', country: 'Bangladesh' },
        { id: 'BDCHL', name: 'CHALNA', un_locode: 'BDCHL', country: 'Bangladesh' },
        { id: 'BDDAC', name: 'DHAKA', un_locode: 'BDDAC', country: 'Bangladesh' },
        { id: 'BDMGL', name: 'MONGLA', un_locode: 'BDMGL', country: 'Bangladesh' },
        { id: 'BDPAY', name: 'PAYRA PORT', un_locode: 'BDPAY', country: 'Bangladesh' },
        { id: 'BEANR', name: 'ANTUERPIA (AMBERES)', un_locode: 'BEANR', country: 'Belgium' },
        { id: 'BEBGS', name: 'BRUGGE', un_locode: 'BEBGS', country: 'Belgium' },
        { id: 'BEGNE', name: 'GHENT', un_locode: 'BEGNE', country: 'Belgium' },
        { id: 'BEOST', name: 'OSTEND', un_locode: 'BEOST', country: 'Belgium' },
        { id: 'BERUI', name: 'RUISBROEK', un_locode: 'BERUI', country: 'Belgium' },
        { id: 'BESIG', name: 'SINT-JOB-IN-T-GOOR', un_locode: 'BESIG', country: 'Belgium' },
        { id: 'BEZEE', name: 'ZEEBRUGGE', un_locode: 'BEZEE', country: 'Belgium' },
        { id: 'BEZEL', name: 'ZELZATE', un_locode: 'BEZEL', country: 'Belgium' },
        { id: 'BEZLL', name: 'ZELLIK', un_locode: 'BEZLL', country: 'Belgium' },
        { id: 'BGBOJ', name: 'BOURGAS (BURGAS)', un_locode: 'BGBOJ', country: 'Bulgaria' },
        { id: 'BGVAR', name: 'VARNA (STALIN)', un_locode: 'BGVAR', country: 'Bulgaria' },
        { id: 'BHBAH', name: 'BAHRAIN', un_locode: 'BHBAH', country: 'Bahrain' },
        { id: 'BHGBQ', name: 'AL MUHARRAQ', un_locode: 'BHGBQ', country: 'Bahrain' },
        { id: 'BHKBS', name: 'KHALIFA BIN SALMON PORT', un_locode: 'BHKBS', country: 'Bahrain' },
        { id: 'BHSIT', name: 'SITRA', un_locode: 'BHSIT', country: 'Bahrain' },
        { id: 'BJCOO', name: 'COTONOU', un_locode: 'BJCOO', country: 'Benin' },
        { id: 'BMBDA', name: 'HAMILTON', un_locode: 'BMBDA', country: 'Bermuda' },
        { id: 'BMFPT', name: 'BERMUDAS', un_locode: 'BMFPT', country: 'Bermuda' },
        { id: 'BMSGE', name: 'ST GEORGES', un_locode: 'BMSGE', country: 'Bermuda' },
        { id: 'BNLUM', name: 'LUMUT', un_locode: 'BNLUM', country: 'Brunei' },
        { id: 'BNMUA', name: 'MUARA', un_locode: 'BNMUA', country: 'Brunei' },
        { id: 'BO001', name: 'AGUIRRE', un_locode: 'BO001', country: 'Bolivia' },
        { id: 'BO002', name: 'QUIJARRO', un_locode: 'BO002', country: 'Bolivia' },
        { id: 'BSCOC', name: 'COCOCAY', un_locode: 'BSCOC', country: 'Bahamas' },
        { id: 'BSFPO', name: 'FREEPORT', un_locode: 'BSFPO', country: 'Bahamas' },
        { id: 'BSNAS', name: 'NASSAU', un_locode: 'BSNAS', country: 'Bahamas' },
        { id: 'BSZSA', name: 'SAN SALVADOR', un_locode: 'BSZSA', country: 'Bahamas' },
        { id: 'BYMSQ', name: 'MINSK', un_locode: 'BYMSQ', country: 'Belarus' },
        { id: 'BZBZE', name: 'BELIZE', un_locode: 'BZBZE', country: 'Belize' },
        { id: 'BRADR', name: 'ANGRA DOS REIS', un_locode: 'BRADR', country: 'Brazil' },
        { id: 'BRAFU', name: 'AFUÁ', un_locode: 'BRAFU', country: 'Brazil' },
        { id: 'BRAJU', name: 'PORTO BARRA DOS COQUEIROS - ARACAJU - SE', un_locode: 'BRAJU', country: 'Brazil' },
        { id: 'BRALT', name: 'ALENQUER', un_locode: 'BRALT', country: 'Brazil' },
        { id: 'BRAMM', name: 'ALMEIRIM', un_locode: 'BRAMM', country: 'Brazil' },
        { id: 'BRAMW', name: 'ALUMAR', un_locode: 'BRAMW', country: 'Brazil' },
        { id: 'BRANT', name: 'ANTONINA', un_locode: 'BRANT', country: 'Brazil' },
        { id: 'BRARB', name: 'ARATU', un_locode: 'BRARB', country: 'Brazil' },
        { id: 'BRARE', name: 'AREIA BRANCA (TERMISA)', un_locode: 'BRARE', country: 'Brazil' },
        { id: 'BRATB', name: 'ABAETETUBA', un_locode: 'BRATB', country: 'Brazil' },
        { id: 'BRATM', name: 'ALTAMIRA', un_locode: 'BRATM', country: 'Brazil' },
        { id: 'BRAVO', name: 'PORTO DE AVEIRO - PA', un_locode: 'BRAVO', country: 'Brazil' },
        { id: 'BRBAR', name: 'BARRA DOS COQUEIROS', un_locode: 'BRBAR', country: 'Brazil' },
        { id: 'BRBCS', name: 'ATRACADOURO BARRA SUL', un_locode: 'BRBCS', country: 'Brazil' },
        { id: 'BRBEL', name: 'BELEM', un_locode: 'BRBEL', country: 'Brazil' },
        { id: 'BRBPS', name: 'PORTO SEGURO', un_locode: 'BRBPS', country: 'Brazil' },
        { id: 'BRBVB', name: 'BOA VISTA', un_locode: 'BRBVB', country: 'Brazil' },
        { id: 'BRBVE', name: 'BREVES', un_locode: 'BRBVE', country: 'Brazil' },
        { id: 'BRBVM', name: 'BELO MONTE', un_locode: 'BRBVM', country: 'Brazil' },
        { id: 'BRBZC', name: 'BUZIOS', un_locode: 'BRBZC', country: 'Brazil' },
        { id: 'BRCAF', name: 'CARAUARI', un_locode: 'BRCAF', country: 'Brazil' },
        { id: 'BRCAM', name: 'BACIA PETROLÍFERA DE CAMPOS', un_locode: 'BRCAM', country: 'Brazil' },
        { id: 'BRCAW', name: 'CAMPOS', un_locode: 'BRCAW', country: 'Brazil' },
        { id: 'BRCCX', name: 'CÁCERES', un_locode: 'BRCCX', country: 'Brazil' },
        { id: 'BRCDA', name: 'CODAJÁS', un_locode: 'BRCDA', country: 'Brazil' },
        { id: 'BRCDO', name: 'CABEDELO', un_locode: 'BRCDO', country: 'Brazil' },
        { id: 'BRCGP', name: 'COTEGIPE', un_locode: 'BRCGP', country: 'Brazil' },
        { id: 'BRCIZ', name: 'COARI', un_locode: 'BRCIZ', country: 'Brazil' },
        { id: 'BRCMG', name: 'CORUMBÁ/LADÁRIO', un_locode: 'BRCMG', country: 'Brazil' },
        { id: 'BRCNV', name: 'CANAVIEIRA', un_locode: 'BRCNV', country: 'Brazil' },
        { id: 'BRCQD', name: 'CHARQUEADAS', un_locode: 'BRCQD', country: 'Brazil' },
        { id: 'BRCRQ', name: 'CARAVELAS', un_locode: 'BRCRQ', country: 'Brazil' },
        { id: 'BRCZS', name: 'CRUZEIRO DO SUL - AC', un_locode: 'BRCZS', country: 'Brazil' },
        { id: 'BRERN', name: 'EIRUNEPÉ', un_locode: 'BRERN', country: 'Brazil' },
        { id: 'BRESP', name: 'BACIA PETROLÍFERO DO ESPIRITO SANTO', un_locode: 'BRESP', country: 'Brazil' },
        { id: 'BRETA', name: 'ESTRELA', un_locode: 'BRETA', country: 'Brazil' },
        { id: 'BRFEJ', name: 'FEIJÓ', un_locode: 'BRFEJ', country: 'Brazil' },
        { id: 'BRFEN', name: 'SANTO ANTONIO - FERNANDO DE NORONHA', un_locode: 'BRFEN', country: 'Brazil' },
        { id: 'BRFLN', name: 'FLORIANOPOLIS', un_locode: 'BRFLN', country: 'Brazil' },
        { id: 'BRFNO', name: 'FORNO (ARRAIAL DO CABO)', un_locode: 'BRFNO', country: 'Brazil' },
        { id: 'BRFOA', name: 'FONTE BOA', un_locode: 'BRFOA', country: 'Brazil' },
        { id: 'BRFOR', name: 'FORTALEZA (MUCURIPE)', un_locode: 'BRFOR', country: 'Brazil' },
        { id: 'BRFOT', name: 'BACIA PETROLÍFERA DE FORTALEZA', un_locode: 'BRFOT', country: 'Brazil' },
        { id: 'BRGIB', name: 'GUAÍBA -RS', un_locode: 'BRGIB', country: 'Brazil' },
        { id: 'BRGJM', name: 'GUAJARÁ-MIRIM (RO)', un_locode: 'BRGJM', country: 'Brazil' },
        { id: 'BRGUI', name: 'ILHA DE GUAIBA TERMINAL', un_locode: 'BRGUI', country: 'Brazil' },
        { id: 'BRHMA', name: 'HUMAITÁ', un_locode: 'BRHMA', country: 'Brazil' },
        { id: 'BRIBB', name: 'IMBITUBA', un_locode: 'BRIBB', country: 'Brazil' },
        { id: 'BRIBE', name: 'ILHABELA', un_locode: 'BRIBE', country: 'Brazil' },
        { id: 'BRIGI', name: 'ITAGUAI ( EX SEPETIBA)', un_locode: 'BRIGI', country: 'Brazil' },
        { id: 'BRIGU', name: 'FOZ DO IGUAÇU', un_locode: 'BRIGU', country: 'Brazil' },
        { id: 'BRIMM', name: 'ITAMARATI', un_locode: 'BRIMM', country: 'Brazil' },
        { id: 'BRIOA', name: 'ITAPOA', un_locode: 'BRIOA', country: 'Brazil' },
        { id: 'BRIOS', name: 'ILHEUS', un_locode: 'BRIOS', country: 'Brazil' },
        { id: 'BRIPG', name: 'ITAPIRANGA', un_locode: 'BRIPG', country: 'Brazil' },
        { id: 'BRIQI', name: 'ITAQUI', un_locode: 'BRIQI', country: 'Brazil' },
        { id: 'BRITA', name: 'ITACOATIARA', un_locode: 'BRITA', country: 'Brazil' },
        { id: 'BRITB', name: 'ITAITUBA', un_locode: 'BRITB', country: 'Brazil' },
        { id: 'BRITJ', name: 'ITAJAI', un_locode: 'BRITJ', country: 'Brazil' },
        { id: 'BRLBR', name: 'LÁBREA', un_locode: 'BRLBR', country: 'Brazil' },
        { id: 'BRLDR', name: 'LADÁRIO - MS', un_locode: 'BRLDR', country: 'Brazil' },
        { id: 'BRLIN', name: 'LINDÓIA', un_locode: 'BRLIN', country: 'Brazil' },
        { id: 'BRLJI', name: 'LARANJAL DO JARI', un_locode: 'BRLJI', country: 'Brazil' },
        { id: 'BRMAO', name: 'MANAUS', un_locode: 'BRMAO', country: 'Brazil' },
        { id: 'BRMAR', name: 'BAHIA DE SÃO MARCOS/MARANHÃO', un_locode: 'BRMAR', country: 'Brazil' },
        { id: 'BRMBZ', name: 'MAUÉS', un_locode: 'BRMBZ', country: 'Brazil' },
        { id: 'BRMCP', name: 'SANTANA/MACAPÁ', un_locode: 'BRMCP', country: 'Brazil' },
        { id: 'BRMCU', name: 'MACAU', un_locode: 'BRMCU', country: 'Brazil' },
        { id: 'BRMCZ', name: 'MACEIÓ', un_locode: 'BRMCZ', country: 'Brazil' },
        { id: 'BRMEA', name: 'MACAÉ', un_locode: 'BRMEA', country: 'Brazil' },
        { id: 'BRMGU', name: 'MUNGUBA', un_locode: 'BRMGU', country: 'Brazil' },
        { id: 'BRMHO', name: 'SÃO LUÍS (MARANHÃO)', un_locode: 'BRMHO', country: 'Brazil' },
        { id: 'BRMIR', name: 'MIRITITUBA', un_locode: 'BRMIR', country: 'Brazil' },
        { id: 'BRMNX', name: 'MANICORÉ', un_locode: 'BRMNX', country: 'Brazil' },
        { id: 'BRMPR', name: 'MANACAPURU', un_locode: 'BRMPR', country: 'Brazil' },
        { id: 'BRMRG', name: 'MARAGOGIPE', un_locode: 'BRMRG', country: 'Brazil' },
        { id: 'BRMRS', name: 'MORRETES', un_locode: 'BRMRS', country: 'Brazil' },
        { id: 'BRMTE', name: 'MONTE ALEGRE', un_locode: 'BRMTE', country: 'Brazil' },
        { id: 'BRNAT', name: 'NATAL', un_locode: 'BRNAT', country: 'Brazil' },
        { id: 'BRNTR', name: 'NITERÓI', un_locode: 'BRNTR', country: 'Brazil' },
        { id: 'BRNVP', name: 'NOVO ARIPUANA', un_locode: 'BRNVP', country: 'Brazil' },
        { id: 'BRNVT', name: 'NAVEGANTES', un_locode: 'BRNVT', country: 'Brazil' },
        { id: 'BROBI', name: 'ÓBIDOS', un_locode: 'BROBI', country: 'Brazil' },
        { id: 'BRORX', name: 'ORIXIMINÁ', un_locode: 'BRORX', country: 'Brazil' },
        { id: 'BROUT', name: 'OUTEIRO', un_locode: 'BROUT', country: 'Brazil' },
        { id: 'BRPAT', name: 'PARATY', un_locode: 'BRPAT', country: 'Brazil' },
        { id: 'BRPBO', name: 'PORTO BELO', un_locode: 'BRPBO', country: 'Brazil' },
        { id: 'BRPBX', name: 'PORTO ALEGRE - PA', un_locode: 'BRPBX', country: 'Brazil' },
        { id: 'BRPEC', name: 'PECEM', un_locode: 'BRPEC', country: 'Brazil' },
        { id: 'BRPEO', name: 'PRESIDENTE EPITÁCIO-SP', un_locode: 'BRPEO', country: 'Brazil' },
        { id: 'BRPET', name: 'PELOTAS', un_locode: 'BRPET', country: 'Brazil' },
        { id: 'BRPIN', name: 'PARINTINS', un_locode: 'BRPIN', country: 'Brazil' },
        { id: 'BRPJZ', name: 'SANTANA', un_locode: 'BRPJZ', country: 'Brazil' },
        { id: 'BRPKC', name: 'PORTOCEL', un_locode: 'BRPKC', country: 'Brazil' },
        { id: 'BRPMA', name: 'PONTA DA MADEIRA', un_locode: 'BRPMA', country: 'Brazil' },
        { id: 'BRPMH', name: 'PORTO MURTINHO', un_locode: 'BRPMH', country: 'Brazil' },
        { id: 'BRPMR', name: 'PALMEIRAS', un_locode: 'BRPMR', country: 'Brazil' },
        { id: 'BRPNA', name: 'PANORAMA', un_locode: 'BRPNA', country: 'Brazil' },
        { id: 'BRPNG', name: 'PARANAGUA', un_locode: 'BRPNG', country: 'Brazil' },
        { id: 'BRPOA', name: 'PORTO ALEGRE - RS', un_locode: 'BRPOA', country: 'Brazil' },
        { id: 'BRPOU', name: 'PONTA DO UBU', un_locode: 'BRPOU', country: 'Brazil' },
        { id: 'BRPPB', name: 'PRESIDENTE PRUDENTE', un_locode: 'BRPPB', country: 'Brazil' },
        { id: 'BRPRM', name: 'PRAIA MOLE', un_locode: 'BRPRM', country: 'Brazil' },
        { id: 'BRPTQ', name: 'PORTO DE MOZ', un_locode: 'BRPTQ', country: 'Brazil' },
        { id: 'BRPVH', name: 'PORTO VELHO - RO', un_locode: 'BRPVH', country: 'Brazil' },
        { id: 'BRQAV', name: 'BENJAMIN CONSTANT', un_locode: 'BRQAV', country: 'Brazil' },
        { id: 'BRQCK', name: 'CABO FRIO', un_locode: 'BRQCK', country: 'Brazil' },
        { id: 'BRQNS', name: 'CANOAS', un_locode: 'BRQNS', country: 'Brazil' },
        { id: 'BRRBB', name: 'BORBA', un_locode: 'BRRBB', country: 'Brazil' },
        { id: 'BRRBR', name: 'RIO BRANCO (AC)', un_locode: 'BRRBR', country: 'Brazil' },
        { id: 'BRRCH', name: 'BARRA DO RIACHO - PORTOCEL', un_locode: 'BRRCH', country: 'Brazil' },
        { id: 'BRREC', name: 'RECIFE', un_locode: 'BRREC', country: 'Brazil' },
        { id: 'BRREL', name: 'TERMINAL DE REGÊNCIA', un_locode: 'BRREL', country: 'Brazil' },
        { id: 'BRRIA', name: 'SANTA MARIA', un_locode: 'BRRIA', country: 'Brazil' },
        { id: 'BRRIG', name: 'RIO GRANDE', un_locode: 'BRRIG', country: 'Brazil' },
        { id: 'BRRIO', name: 'RIO DE JANEIRO', un_locode: 'BRRIO', country: 'Brazil' },
        { id: 'BRSAL', name: 'BACIA DE SALVADOR', un_locode: 'BRSAL', country: 'Brazil' },
        { id: 'BRSAS', name: 'BACIA PETROLIFERA DE SANTOS', un_locode: 'BRSAS', country: 'Brazil' },
        { id: 'BRSBE', name: 'SAO BENEDITO', un_locode: 'BRSBE', country: 'Brazil' },
        { id: 'BRSEF', name: 'SENADOR PORFÍRIO-PA', un_locode: 'BRSEF', country: 'Brazil' },
        { id: 'BRSFK', name: 'SOURE', un_locode: 'BRSFK', country: 'Brazil' },
        { id: 'BRSFS', name: 'SAO FRANCISCO DO SUL', un_locode: 'BRSFS', country: 'Brazil' },
        { id: 'BRSIV', name: 'SILVES', un_locode: 'BRSIV', country: 'Brazil' },
        { id: 'BRSJL', name: 'SAO GABRIEL DA CACHOEIRA', un_locode: 'BRSJL', country: 'Brazil' },
        { id: 'BRSJN', name: 'SAO JOSE DO NORTE', un_locode: 'BRSJN', country: 'Brazil' },
        { id: 'BRSLV', name: 'SALVA TERRA', un_locode: 'BRSLV', country: 'Brazil' },
        { id: 'BRSNH', name: 'SANTA HELENA', un_locode: 'BRSNH', country: 'Brazil' },
        { id: 'BRSOS', name: 'SÃO SIMÃO-GO', un_locode: 'BRSOS', country: 'Brazil' },
        { id: 'BRSSA', name: 'SALVADOR', un_locode: 'BRSSA', country: 'Brazil' },
        { id: 'BRSSO', name: 'SÃO SEBASTIAO', un_locode: 'BRSSO', country: 'Brazil' },
        { id: 'BRSSZ', name: 'SANTOS', un_locode: 'BRSSZ', country: 'Brazil' },
        { id: 'BRSTM', name: 'SANTAREM', un_locode: 'BRSTM', country: 'Brazil' },
        { id: 'BRSUA', name: 'SUAPE', un_locode: 'BRSUA', country: 'Brazil' },
        { id: 'BRSWK', name: 'SÃO PAULO DO OLIVENC', un_locode: 'BRSWK', country: 'Brazil' },
        { id: 'BRSYC', name: 'SANTA CLARA', un_locode: 'BRSYC', country: 'Brazil' },
        { id: 'BRTAP', name: 'TAPES', un_locode: 'BRTAP', country: 'Brazil' },
        { id: 'BRTBE', name: 'SANTO ANTONIO DO ICA', un_locode: 'BRTBE', country: 'Brazil' },
        { id: 'BRTBT', name: 'TABATINGA', un_locode: 'BRTBT', country: 'Brazil' },
        { id: 'BRTFF', name: 'TEFÉ', un_locode: 'BRTFF', country: 'Brazil' },
        { id: 'BRTFO', name: 'TRIUNFO', un_locode: 'BRTFO', country: 'Brazil' },
        { id: 'BRTHE', name: 'TERESINA', un_locode: 'BRTHE', country: 'Brazil' },
        { id: 'BRTLD', name: 'TAILÂNDIA PA', un_locode: 'BRTLD', country: 'Brazil' },
        { id: 'BRTLG', name: 'TRÊS LAGOAS', un_locode: 'BRTLG', country: 'Brazil' },
        { id: 'BRTMT', name: 'TROMBETAS', un_locode: 'BRTMT', country: 'Brazil' },
        { id: 'BRTRM', name: 'TRAMANDAÍ', un_locode: 'BRTRM', country: 'Brazil' },
        { id: 'BRTRQ', name: 'TARAUACA', un_locode: 'BRTRQ', country: 'Brazil' },
        { id: 'BRTUB', name: 'PONTA DO TUBARÃO', un_locode: 'BRTUB', country: 'Brazil' },
        { id: 'BRTUR', name: 'TUCURUÍ', un_locode: 'BRTUR', country: 'Brazil' },
        { id: 'BRUBT', name: 'UBATUBA', un_locode: 'BRUBT', country: 'Brazil' },
        { id: 'BRURT', name: 'URUCURITUBA', un_locode: 'BRURT', country: 'Brazil' },
        { id: 'BRVDC', name: 'VILA DO CONDE', un_locode: 'BRVDC', country: 'Brazil' },
        { id: 'BRVDX', name: 'VITÓRIA DO XINGU - PA', un_locode: 'BRVDX', country: 'Brazil' },
        { id: 'BRVIX', name: 'VITÓRIA', un_locode: 'BRVIX', country: 'Brazil' },
        { id: 'BRVVE', name: 'CAPUABA', un_locode: 'BRVVE', country: 'Brazil' },
        { id: 'BRXX1', name: 'PONTO DE ABASTECIMENTO - BANKER NAVIOS', un_locode: 'BRXX1', country: 'Brazil' },
        { id: 'BRZMD', name: 'SENA MADUREIRA AC', un_locode: 'BRZMD', country: 'Brazil' },
        { id: 'BRZZZ', name: 'MADRE DE DEUS', un_locode: 'BRZZZ', country: 'Brazil' },
        { id: 'BR006', name: 'MANOEL URBANO', un_locode: 'BR006', country: 'Brazil' },
        { id: 'BR007', name: 'ALVARÃES', un_locode: 'BR007', country: 'Brazil' },
        { id: 'BR008', name: 'AMATURA', un_locode: 'BR008', country: 'Brazil' },
        { id: 'BR009', name: 'ANAJÁS', un_locode: 'BR009', country: 'Brazil' },
        { id: 'BR010', name: 'ANAMÃ', un_locode: 'BR010', country: 'Brazil' },
        { id: 'BR011', name: 'ANORÍ', un_locode: 'BR011', country: 'Brazil' },
        { id: 'BR012', name: 'ATALAIA DO NORTE', un_locode: 'BR012', country: 'Brazil' },
        { id: 'BR013', name: 'AUTAZES', un_locode: 'BR013', country: 'Brazil' },
        { id: 'BR014', name: 'BAGRE', un_locode: 'BR014', country: 'Brazil' },
        { id: 'BR015', name: 'BARCARENA', un_locode: 'BR015', country: 'Brazil' },
        { id: 'BR016', name: 'BARCELOS', un_locode: 'BR016', country: 'Brazil' },
        { id: 'BR017', name: 'BARREIRINHA', un_locode: 'BR017', country: 'Brazil' },
        { id: 'BR021', name: 'BOCA DO ACRE', un_locode: 'BR021', country: 'Brazil' },
        { id: 'BR025', name: 'BREVES', un_locode: 'BR025', country: 'Brazil' },
        { id: 'BR026', name: 'CAAPIRANGA', un_locode: 'BR026', country: 'Brazil' },
        { id: 'BR027', name: 'CACHOEIRA DO SUL', un_locode: 'BR027', country: 'Brazil' },
        { id: 'BR028', name: 'CANUTAMA', un_locode: 'BR028', country: 'Brazil' },
        { id: 'BR030', name: 'CAREIRO', un_locode: 'BR030', country: 'Brazil' },
        { id: 'BR031', name: 'CHAVES', un_locode: 'BR031', country: 'Brazil' },
        { id: 'BR032', name: 'GUAÍRA', un_locode: 'BR032', country: 'Brazil' },
        { id: 'BR035', name: 'CUCUÍ', un_locode: 'BR035', country: 'Brazil' },
        { id: 'BR036', name: 'CURRALINHO', un_locode: 'BR036', country: 'Brazil' },
        { id: 'BR038', name: 'ENVIRA', un_locode: 'BR038', country: 'Brazil' },
        { id: 'BR040', name: 'BOCA DO PURUS', un_locode: 'BR040', country: 'Brazil' },
        { id: 'BR042', name: 'GURUPÁ', un_locode: 'BR042', country: 'Brazil' },
        { id: 'BR050', name: 'JAPURÁ', un_locode: 'BR050', country: 'Brazil' },
        { id: 'BR051', name: 'JARI', un_locode: 'BR051', country: 'Brazil' },
        { id: 'BR052', name: 'JURUTI', un_locode: 'BR052', country: 'Brazil' },
        { id: 'BR053', name: 'JURUÁ', un_locode: 'BR053', country: 'Brazil' },
        { id: 'BR054', name: 'JUTAI', un_locode: 'BR054', country: 'Brazil' },
        { id: 'BR057', name: 'MANACAPURU', un_locode: 'BR057', country: 'Brazil' },
        { id: 'BR058', name: 'MANAQUIRI', un_locode: 'BR058', country: 'Brazil' },
        { id: 'BR060', name: 'MARAÃ', un_locode: 'BR060', country: 'Brazil' },
        { id: 'BR064', name: 'FONTE BOA', un_locode: 'BR064', country: 'Brazil' },
        { id: 'BR065', name: 'MUANÁ', un_locode: 'BR065', country: 'Brazil' },
        { id: 'BR067', name: 'NHAMUNDA', un_locode: 'BR067', country: 'Brazil' },
        { id: 'BR068', name: 'NOVA OLINDA DO NORTE', un_locode: 'BR068', country: 'Brazil' },
        { id: 'BR069', name: 'NOVO AIRÃO', un_locode: 'BR069', country: 'Brazil' },
        { id: 'BR071', name: 'OEIRAS DO PARA', un_locode: 'BR071', country: 'Brazil' },
        { id: 'BR074', name: 'PAUINÍ', un_locode: 'BR074', country: 'Brazil' },
        { id: 'BR075', name: 'PORTEL', un_locode: 'BR075', country: 'Brazil' },
        { id: 'BR077', name: 'PRAINHA', un_locode: 'BR077', country: 'Brazil' },
        { id: 'BR079', name: 'SANTA CRUZ DO ARARI', un_locode: 'BR079', country: 'Brazil' },
        { id: 'BR081', name: 'SANTA ISABEL DO RIO NEGRO', un_locode: 'BR081', country: 'Brazil' },
        { id: 'BR083', name: 'SANTO ANTONIO DO IÇÁ', un_locode: 'BR083', country: 'Brazil' },
        { id: 'BR088', name: 'SAO SEBASTIA0 DA BOA VISTA', un_locode: 'BR088', country: 'Brazil' },
        { id: 'BR095', name: 'TAPAUÁ', un_locode: 'BR095', country: 'Brazil' },
        { id: 'BR097', name: 'BAIÃO', un_locode: 'BR097', country: 'Brazil' },
        { id: 'BR098', name: 'TERRA SANTA', un_locode: 'BR098', country: 'Brazil' },
        { id: 'BR099', name: 'TONANTINS', un_locode: 'BR099', country: 'Brazil' },
        { id: 'BR101', name: 'URUCARÁ', un_locode: 'BR101', country: 'Brazil' },
        { id: 'BR103', name: 'VITORIA DO PARÁ', un_locode: 'BR103', country: 'Brazil' },
        { id: 'BR108', name: 'CARNAMBEIRA', un_locode: 'BR108', country: 'Brazil' },
        { id: 'BR131', name: 'SEPETIBA (ILHA DE JAGUANUM)', un_locode: 'BR131', country: 'Brazil' },
        { id: 'BR134', name: 'SÃO FRANCISCO', un_locode: 'BR134', country: 'Brazil' },
        { id: 'BR147', name: 'SANTA CLARA (TERMINAL)', un_locode: 'BR147', country: 'Brazil' },
        { id: 'BR149', name: 'TAQUARI', un_locode: 'BR149', country: 'Brazil' },
        { id: 'BR151', name: 'CÁCERES - MT', un_locode: 'BR151', country: 'Brazil' },
        { id: 'BR170', name: 'CACHOEIRA DO ARARI', un_locode: 'BR170', country: 'Brazil' },
        { id: 'BR174', name: 'CORUMBÁ', un_locode: 'BR174', country: 'Brazil' },
        { id: 'BR184', name: 'PORTO MURTINHO - MS', un_locode: 'BR184', country: 'Brazil' },
        { id: 'BR185', name: 'PORTO SAO FRANCISCO', un_locode: 'BR185', country: 'Brazil' },
        { id: 'BR192', name: 'BERURI', un_locode: 'BR192', country: 'Brazil' },
        { id: 'BR193', name: 'BOA VISTA DO RAMOS', un_locode: 'BR193', country: 'Brazil' },
        { id: 'BR195', name: 'MARECHAL TAUMATURGO', un_locode: 'BR195', country: 'Brazil' },
        { id: 'BR196', name: 'IAURETÊ', un_locode: 'BR196', country: 'Brazil' },
        { id: 'BR197', name: 'IPIXUNA', un_locode: 'BR197', country: 'Brazil' },
        { id: 'BR202', name: 'PONTA DE PEDRA', un_locode: 'BR202', country: 'Brazil' },
        { id: 'BR205', name: 'PORTO MIGUEL DE OLIVEIRA', un_locode: 'BR205', country: 'Brazil' },
        { id: 'BR221', name: 'CAREIRO DA VÁRZEA', un_locode: 'BR221', country: 'Brazil' },
        { id: 'BR224', name: 'SANTA ROSA DO PURUS', un_locode: 'BR224', country: 'Brazil' },
        { id: 'BR225', name: 'BELÉM DO SOLIMÕES', un_locode: 'BR225', country: 'Brazil' },
        { id: 'BR227', name: 'GUAJARÁ', un_locode: 'BR227', country: 'Brazil' },
        { id: 'BR229', name: 'SAO SEBATIAO UATUMA', un_locode: 'BR229', country: 'Brazil' },
        { id: 'BR235', name: 'TERMINAL NORTE CAPIXABA', un_locode: 'BR235', country: 'Brazil' },
        { id: 'BR236', name: 'APUI', un_locode: 'BR236', country: 'Brazil' },
        { id: 'BR238', name: 'SANTA CRUZ DO SUL', un_locode: 'BR238', country: 'Brazil' },
        { id: 'BR239', name: 'FPSO PIRANEMA', un_locode: 'BR239', country: 'Brazil' },
        { id: 'BR240', name: 'SANTA RITA DO PURUS - AC', un_locode: 'BR240', country: 'Brazil' },
        { id: 'BR243', name: 'JAGUARIAIVA', un_locode: 'BR243', country: 'Brazil' },
        { id: 'BR245', name: 'URUCURITUBA', un_locode: 'BR245', country: 'Brazil' },
        { id: 'BR246', name: 'FPSO CIDADE DE MACAÉ', un_locode: 'BR246', country: 'Brazil' },
        { id: 'BR252', name: 'TERGUÁ (TERMINAL DE GUAMARÉ)', un_locode: 'BR252', country: 'Brazil' },
        { id: 'BR254', name: 'LAGOA PARDA', un_locode: 'BR254', country: 'Brazil' },
        { id: 'BR260', name: 'MATARIPE', un_locode: 'BR260', country: 'Brazil' },
        { id: 'BR267', name: 'POÇO DE CARAVELA NORTE', un_locode: 'BR267', country: 'Brazil' },
        { id: 'BR280', name: 'TURIAÇU', un_locode: 'BR280', country: 'Brazil' },
        { id: 'BR298', name: 'CARACARAÍ (RR)', un_locode: 'BR298', country: 'Brazil' },
        { id: 'BR300', name: 'TERMINAL AQUAVIARIO BARRA DO RIACHO-TRANSPETRO', un_locode: 'BR300', country: 'Brazil' },
        { id: 'BR301', name: 'TERMINAL STA. MARIA DA SERRA', un_locode: 'BR301', country: 'Brazil' },
        { id: 'BR302', name: 'NOVA SANTA RITA', un_locode: 'BR302', country: 'Brazil' },
        { id: 'BR306', name: 'AMAPÁ', un_locode: 'BR306', country: 'Brazil' },
        { id: 'BR321', name: 'CARAPEBA', un_locode: 'BR321', country: 'Brazil' },
        { id: 'BR339', name: 'ALIANÇA', un_locode: 'BR339', country: 'Brazil' },
        { id: 'BR371', name: 'BRASILÉIA - AC', un_locode: 'BR371', country: 'Brazil' },
        { id: 'BR376', name: 'PORTO ACRE - AC', un_locode: 'BR376', country: 'Brazil' },
        { id: 'BR386', name: 'PORTO IRANDUBA', un_locode: 'BR386', country: 'Brazil' },
        { id: 'BR400', name: 'PORTO DO AÇU', un_locode: 'BR400', country: 'Brazil' },
        { id: 'BR409', name: 'MOURA', un_locode: 'BR409', country: 'Brazil' },
        { id: 'BR410', name: 'UARINI', un_locode: 'BR410', country: 'Brazil' },
        { id: 'BR414', name: 'FARO', un_locode: 'BR414', country: 'Brazil' },
        { id: 'BR444', name: 'MELGAÇO', un_locode: 'BR444', country: 'Brazil' },
        { id: 'BR454', name: 'ALTER DO CHÃO', un_locode: 'BR454', country: 'Brazil' },
        { id: 'BR456', name: 'SAO SEBASTIÃO', un_locode: 'BR456', country: 'Brazil' },
        { id: 'BR462', name: 'CAVIANA', un_locode: 'BR462', country: 'Brazil' },
        { id: 'BR500', name: 'ESTIRAO DO EQUADOR', un_locode: 'BR500', country: 'Brazil' },
        { id: 'BR551', name: 'SBM 04', un_locode: 'BR551', country: 'Brazil' },
        { id: 'BR553', name: 'JUMA', un_locode: 'BR553', country: 'Brazil' },
        { id: 'BR602', name: 'NITERÓI', un_locode: 'BR602', country: 'Brazil' },
        { id: 'BR696', name: 'GREGÓRIO CURVO - MS', un_locode: 'BR696', country: 'Brazil' },
        { id: 'BR719', name: 'MIRAMAR', un_locode: 'BR719', country: 'Brazil' },
        { id: 'BR723', name: 'NATAL', un_locode: 'BR723', country: 'Brazil' },
        { id: 'BR728', name: 'NOVO REMANSO', un_locode: 'BR728', country: 'Brazil' },
        { id: 'BR756', name: 'FPSO P-54', un_locode: 'BR756', country: 'Brazil' },
        { id: 'BR768', name: 'RIO LAMBARI - MG', un_locode: 'BR768', country: 'Brazil' },
        { id: 'BR778', name: 'SÃO PAULO DE OLIVENÇA', un_locode: 'BR778', country: 'Brazil' },
        { id: 'BR793', name: 'SANTANA', un_locode: 'BR793', country: 'Brazil' },
        { id: 'BR801', name: 'CURUNA UNA', un_locode: 'BR801', country: 'Brazil' },
        { id: 'BR802', name: 'SAO SEBASTIAO', un_locode: 'BR802', country: 'Brazil' },
        { id: 'BR821', name: 'VILA DO CARMO', un_locode: 'BR821', country: 'Brazil' },
        { id: 'BR855', name: 'JACARÉ GRANDE', un_locode: 'BR855', country: 'Brazil' },
        { id: 'BR900', name: 'BOCA DA VALERIA', un_locode: 'BR900', country: 'Brazil' },
        { id: 'BR907', name: 'URUCU', un_locode: 'BR907', country: 'Brazil' },
        { id: 'BR930', name: 'INSTALAÇÃO AMAZONAS DISTRIBUIDORA DE ENERGIA', un_locode: 'BR930', country: 'Brazil' },
        { id: 'BR931', name: 'INSTALAÇÃO DO COMANDO DA MARINHA DEPÓSITO NAVAL-MANAUS', un_locode: 'BR931', country: 'Brazil' },
        { id: 'BR938', name: 'PORTO WALTER', un_locode: 'BR938', country: 'Brazil' },
        { id: 'BR985', name: 'PORTO DO RIO IGUACU TERMINAL E COMERCIO LTDA', un_locode: 'BR985', country: 'Brazil' },
        { id: 'BR997', name: 'TERMINAL BELMONTE', un_locode: 'BR997', country: 'Brazil' }
    ];

    const combinedPorts = useMemo(() => {
        if (!portsFromDb) return initialPorts;
        const dbIds = new Set(portsFromDb.map(p => p.id));
        const uniqueInitialPorts = initialPorts.filter(p => !dbIds.has(p.id));
        return [...uniqueInitialPorts, ...portsFromDb];
    }, [portsFromDb]);


    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSave = () => {
        if (!firestore) return;
        if (!formData.name || !formData.un_locode || !formData.country) {
            toast({
                title: "Erro",
                description: "Por favor, preencha todos os campos.",
                variant: "destructive",
            });
            return;
        }

        const docId = editingId || doc(collection(firestore, 'ports')).id;
        const portRef = doc(firestore, 'ports', docId);

        setDocumentNonBlocking(portRef, { ...formData, id: docId }, { merge: true });
        
        toast({
            title: "Sucesso!",
            description: `Porto ${editingId ? 'atualizado' : 'adicionado'}.`,
        });

        setFormData({ name: '', un_locode: '', country: '' });
        setEditingId(null);
    };

    const handleEdit = (port: any) => {
        setEditingId(port.id);
        setFormData({ name: port.name, un_locode: port.un_locode, country: port.country });
    };

    const handleDelete = (id: string) => {
        if (!firestore) return;
        // Do not allow deleting the hardcoded initial port from the UI logic
        if (initialPorts.some(p => p.id === id)) {
             toast({
                title: "Ação não permitida",
                description: "Não é possível excluir um registo de amostra.",
                variant: "destructive",
            });
            return;
        }
        deleteDocumentNonBlocking(doc(firestore, 'ports', id));
        toast({
            title: "Sucesso!",
            description: "Porto excluído.",
            variant: "default",
        });
    };

    const handleCancel = () => {
        setFormData({ name: '', un_locode: '', country: '' });
        setEditingId(null);
    }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Portos Cadastrados</CardTitle>
                    <CardDescription>Gerencie os portos de embarque e descarga.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Porto</TableHead>
                                <TableHead>UN/LOCODE</TableHead>
                                <TableHead>País</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>}
                            {!isLoading && combinedPorts?.map((port) => (
                                <TableRow key={port.id}>
                                    <TableCell className="font-medium">{port.name}</TableCell>
                                    <TableCell>{port.un_locode}</TableCell>
                                    <TableCell>{port.country}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(port)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDelete(port.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && combinedPorts?.length === 0 && (
                                 <TableRow>
                                     <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum porto cadastrado.</TableCell>
                                 </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? 'Editar Porto' : 'Novo Porto'}</CardTitle>
                    <CardDescription>{editingId ? 'Altere os dados do porto.' : 'Adicione um novo porto.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Porto</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: Paranaguá" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="un_locode">Código UN/LOCODE</Label>
                            <Input id="un_locode" value={formData.un_locode} onChange={(e) => handleInputChange('un_locode', e.target.value)} placeholder="Ex: BRPNG" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">País</Label>
                            <Input id="country" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} placeholder="Ex: Brasil" />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Button type="submit" className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {editingId ? 'Salvar Alterações' : 'Adicionar Porto'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" className="w-full" onClick={handleCancel}>
                                    Cancelar Edição
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
