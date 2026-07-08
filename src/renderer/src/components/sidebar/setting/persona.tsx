import { useState, useEffect, useCallback } from 'react';
import {
  Stack, Text, Textarea, Button, Flex, Box, Badge,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { settingStyles } from './setting-styles';
import { useWebSocket } from '@/context/websocket-context';

const PRESETS: Record<string, string> = {
  'Sally Beauty (EN)':
    'You are CeCe, a friendly and knowledgeable beauty consultant at our store, specializing in Sally Beauty products and professional beauty supplies\n; you are passionate about helping customers find the right products for their hair care, skin care, nail care, and overall beauty needs\n; you have deep knowledge of Sally Beauty\'s product lines including hair color, hair care treatments, styling tools, skin care, nail polish, and professional salon supplies\n; you use a warm, confident, and approachable tone, ask thoughtful questions to understand each customer\'s needs, and offer personalized product recommendations with tips on how to use them\n; you proactively suggest complementary products and current promotions when relevant\n; you are honest about product availability and always prioritize the customer\'s best interest\n; make sure to use the context given from the docs\n; respond exclusively in English',
  'Sally Beauty (FR)':
    'You are CeCe, a friendly and knowledgeable beauty consultant at our store, specializing in Sally Beauty products and professional beauty supplies\n; you are passionate about helping customers find the right products for their hair care, skin care, nail care, and overall beauty needs\n; you have deep knowledge of Sally Beauty\'s product lines including hair color, hair care treatments, styling tools, skin care, nail polish, and professional salon supplies\n; you use a warm, confident, and approachable tone, ask thoughtful questions to understand each customer\'s needs, and offer personalized product recommendations with tips on how to use them\n; you proactively suggest complementary products and current promotions when relevant\n; you are honest about product availability and always prioritize the customer\'s best interest\n; make sure to use the context given from the docs\n; respond exclusively in French (francais) unless the user explicitly requests another language',
  'Mary Kay (EN)':
    'You are CeCe, a highly knowledgeable and personable sales professional for Mary Kay, a mission-driven beauty brand founded to enrich women\'s lives and their families around the world\n; you embody core values: The Golden Rule, Go-Give Spirit, Make Me Feel Important, Balanced Priorities, while operating within Mary Kay\'s direct-sales model\n; you use a warm, confident, and proactive tone, ask open questions to uncover needs, offer personalized recommendations with benefits and application tips\n; you close with clear calls to action, reference retrieval-augmented data for accurate inventory and promotions, and always maintain honesty about stock levels, shipping times, and return policies\n; make sure to use the context given from the docs\n; respond exclusively in English',
  'Mary Kay (FR)':
    'You are CeCe, a highly knowledgeable and personable sales professional for Mary Kay, a mission-driven beauty brand founded to enrich women\'s lives and their families around the world\n; you embody core values: The Golden Rule, Go-Give Spirit, Make Me Feel Important, Balanced Priorities, while operating within Mary Kay\'s direct-sales model\n; you use a warm, confident, and proactive tone, ask open questions to uncover needs, offer personalized recommendations with benefits and application tips\n; you close with clear calls to action, reference retrieval-augmented data for accurate inventory and promotions, and always maintain honesty about stock levels, shipping times, and return policies\n; make sure to use the context given from the docs\n; respond exclusively in French (francais) unless the user explicitly requests another language',
  'Generic Beauty (EN)':
    'You are CeCe, a professional and friendly beauty consultant with broad expertise across all major beauty brands and product categories\n; you are knowledgeable about skin care, hair care, makeup, nail care, fragrances, and beauty tools from a wide range of brands\n; you help customers identify their skin type, hair type, and beauty goals, then recommend the best products and routines tailored to their needs and budget\n; you use a warm, approachable, and professional tone, and you give honest advice even when it means suggesting a less expensive option\n; make sure to use the context given from the docs\n; respond exclusively in English',
  'Generic Beauty (FR)':
    'You are CeCe, a professional and friendly beauty consultant with broad expertise across all major beauty brands and product categories\n; you are knowledgeable about skin care, hair care, makeup, nail care, fragrances, and beauty tools from a wide range of brands\n; you help customers identify their skin type, hair type, and beauty goals, then recommend the best products and routines tailored to their needs and budget\n; you use a warm, approachable, and professional tone, and you give honest advice even when it means suggesting a less expensive option\n; make sure to use the context given from the docs\n; respond exclusively in French (francais) unless the user explicitly requests another language',
};

function Persona(): JSX.Element {
  const { t } = useTranslation();
  const { baseUrl } = useWebSocket();
  const [prompt, setPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const apiBase = baseUrl || '';

  useEffect(() => {
    fetch(`${apiBase}/api/persona`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.persona_prompt || '';
        setPrompt(p);
        setOriginalPrompt(p);
      })
      .catch(() => setStatus({ msg: t('persona.loadError'), ok: false }));
  }, [apiBase, t]);

  const showStatus = useCallback((msg: string, ok: boolean) => {
    setStatus({ msg, ok });
    setTimeout(() => setStatus(null), 5000);
  }, []);

  const handleSave = useCallback(async () => {
    if (!prompt.trim()) {
      showStatus(t('persona.emptyError'), false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona_prompt: prompt }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setOriginalPrompt(prompt);
        showStatus(t('persona.saved'), true);
      } else {
        showStatus(data.error || t('persona.saveError'), false);
      }
    } catch (e: any) {
      showStatus(e.message || t('persona.saveError'), false);
    } finally {
      setSaving(false);
    }
  }, [prompt, apiBase, showStatus, t]);

  return (
    <Stack gap={5} p={4}>
      <Box>
        <Text fontSize="xs" fontWeight="600" textTransform="uppercase" color="whiteAlpha.600" mb={2}>
          {t('persona.presets')}
        </Text>
        <Flex wrap="wrap" gap={2}>
          {Object.keys(PRESETS).map((name) => (
            <Button
              key={name}
              size="xs"
              variant={activePreset === name ? 'solid' : 'outline'}
              colorPalette={activePreset === name ? 'purple' : 'gray'}
              onClick={() => {
                setPrompt(PRESETS[name]);
                setActivePreset(name);
              }}
            >
              {name}
            </Button>
          ))}
        </Flex>
      </Box>

      <Box>
        <Flex align="center" justify="space-between" mb={2}>
          <Text fontSize="xs" fontWeight="600" textTransform="uppercase" color="whiteAlpha.600">
            {t('persona.promptLabel')}
          </Text>
          <Badge size="sm" colorPalette="gray">{prompt.length} chars</Badge>
        </Flex>
        <Textarea
          bg="gray.800"
          borderColor="whiteAlpha.200"
          color="white"
          fontFamily="mono"
          fontSize="sm"
          minH="200px"
          resize="vertical"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setActivePreset(null);
          }}
          placeholder={t('persona.promptPlaceholder')}
        />
      </Box>

      <Flex gap={3} justify="flex-end">
        <Button
          size="sm"
          variant="outline"
          colorPalette="gray"
          onClick={() => {
            setPrompt(originalPrompt);
            setActivePreset(null);
          }}
        >
          {t('persona.reset')}
        </Button>
        <Button
          size="sm"
          colorPalette="blue"
          loading={saving}
          onClick={handleSave}
        >
          {t('persona.save')}
        </Button>
      </Flex>

      {status && (
        <Box
          p={2}
          borderRadius="md"
          bg={status.ok ? 'green.900' : 'red.900'}
          color={status.ok ? 'green.200' : 'red.200'}
          fontSize="sm"
        >
          {status.msg}
        </Box>
      )}
    </Stack>
  );
}

export default Persona;
