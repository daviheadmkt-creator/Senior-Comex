import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown, Search } from 'lucide-react';
import  AISummarizer  from '@/components/ai-summarizer';

const operations = [
  {
    id: 'ORD-001',
    product: 'Soybeans',
    origin: 'Brazil',
    destination: 'China',
    status: 'In Transit',
    updated: '2024-05-22',
    by: 'logistics_op1',
  },
  {
    id: 'ORD-002',
    product: 'Corn',
    origin: 'USA',
    destination: 'Mexico',
    status: 'Delivered',
    updated: '2024-05-20',
    by: 'finance_user',
  },
  {
    id: 'ORD-003',
    product: 'Wheat',
    origin: 'Canada',
    destination: 'Egypt',
    status: 'Processing',
    updated: '2024-05-23',
    by: 'operator2',
  },
  {
    id: 'ORD-004',
    product: 'Coffee Beans',
    origin: 'Colombia',
    destination: 'Germany',
    status: 'Delivered',
    updated: '2024-05-19',
    by: 'admin',
  },
  {
    id: 'ORD-005',
    product: 'Sugar Cane',
    origin: 'Brazil',
    destination: 'India',
    status: 'On Hold',
    updated: '2024-05-21',
    by: 'logistics_op2',
  },
  {
    id: 'ORD-006',
    product: 'Cotton',
    origin: 'USA',
    destination: 'Vietnam',
    status: 'In Transit',
    updated: '2024-05-23',
    by: 'logistics_op1',
  },
];

const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'Delivered':
      return 'default';
    case 'In Transit':
      return 'secondary';
    case 'Processing':
      return 'outline';
    case 'On Hold':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Report Summarization</CardTitle>
          <CardDescription>
            Generate a concise summary of your operational reports using AI for quick insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AISummarizer />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Recent Operations</CardTitle>
              <CardDescription>
                An overview of recent trade and logistics operations.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search operations..." className="pl-8 w-full sm:w-64" />
              </div>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead className="hidden md:table-cell">Product</TableHead>
                <TableHead className="hidden lg:table-cell">Origin</TableHead>
                <TableHead className="hidden lg:table-cell">Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                <TableHead className="hidden sm:table-cell">Updated By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((op) => (
                <TableRow key={op.id}>
                  <TableCell className="font-medium">{op.id}</TableCell>
                  <TableCell className="hidden md:table-cell">{op.product}</TableCell>
                  <TableCell className="hidden lg:table-cell">{op.origin}</TableCell>
                  <TableCell className="hidden lg:table-cell">{op.destination}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(op.status)}>{op.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{op.updated}</TableCell>
                  <TableCell className="hidden sm:table-cell">{op.by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
