
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
      { id: 'BZBZE', name: 'BELIZE', un_locode: 'BZBZE', country: 'Belize' }
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
