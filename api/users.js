const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function normalizePhone(p) { return (p || '').replace(/[^0-9]/g, '').slice(-9); }
const ADMIN_PHONE = process.env.ADMIN_PHONE || '0711826819';

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('id,name,phone,role,city,status,avatar_url,membership_status,created_at');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const action = body.action;

      if (action === 'register') {
        const { phone, password, name, city, role } = body;
        if (!phone || !password || !name) return res.status(400).json({ error: 'missing_fields' });

        const { data: existing } = await supabase.from('users').select('id').eq('phone', phone).maybeSingle();
        if (existing) return res.status(400).json({ error: 'phone_exists' });

        const id = 'u' + Date.now();
        const isAdmin = normalizePhone(phone) === normalizePhone(ADMIN_PHONE);

        const { data, error } = await supabase.from('users').insert({
          id, phone, name, city,
          role: isAdmin ? 'admin' : (role === 'broker' ? 'broker' : 'seller'),
          password_hash: password,
          status: 'active',
          membership_status: 'trial'
        }).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (action === 'login') {
        const { phone, password } = body;
        const { data, error } = await supabase.from('users').select('*').eq('phone', phone).maybeSingle();
        if (error) throw error;
        if (!data || data.password_hash !== password) return res.status(401).json({ error: 'invalid_credentials' });
        return res.status(200).json(data);
      }

      if (action === 'update') {
        const { id, name, city, password, avatar_url } = body;
        if (!id) return res.status(400).json({ error: 'missing_id' });
        const patch = {};
        if (name) patch.name = name;
        if (city) patch.city = city;
        if (password) patch.password_hash = password;
        if (avatar_url) patch.avatar_url = avatar_url;
        const { data, error } = await supabase.from('users').update(patch).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      return res.status(400).json({ error: 'unknown_action' });
    }

    res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
