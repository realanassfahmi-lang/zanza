const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const action = body.action;

      if (action === 'create') {
        const id = 'l' + Date.now();
        const { data, error } = await supabase.from('listings').insert({
          id,
          title: body.title,
          category: body.category,
          price: body.price,
          city: body.city,
          description: body.description || '',
          phone: body.phone,
          seller_id: body.seller_id,
          seller_name: body.seller_name,
          commission_type: body.commission ? 'fixed' : 'negotiable',
          commission_value: body.commission || '',
          photos: body.photos || [],
          status: 'active'
        }).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (action === 'update_status') {
        const { data, error } = await supabase
          .from('listings')
          .update({ status: body.status })
          .eq('id', body.id)
          .select()
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (action === 'delete') {
        const { error } = await supabase.from('listings').delete().eq('id', body.id);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'unknown_action' });
    }

    res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
